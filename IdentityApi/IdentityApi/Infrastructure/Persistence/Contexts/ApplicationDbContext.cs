namespace Persistence.Contexts
{
    using System.Reflection;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Design;
    using Microsoft.Extensions.Configuration;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

    using Application.Interfaces;

    using Domain.Common;
    using Domain.Interfaces;
    using Domain.Entities.Identity;

    public class ApplicationDbContext :
        IdentityDbContext<
            User,
            UserRole,
            string,
            IdentityUserClaim<string>,
            IdentityUserRole<string>,
            IdentityUserLogin<string>,
            RoleClaim,
            IdentityUserToken<string>>
    {
        private readonly IDomainEventDispatcher? _dispatcher;
        private readonly IUser? _user;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options,
          IDomainEventDispatcher dispatcher,
          IUser user)
            : base(options)
        {
            _dispatcher = dispatcher;
            _user = user;
        }

        public override DbSet<UserRole> Roles { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<RsaKey> RsaKeys { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.Ignore(e => e.IsExpired);
                entity.Ignore(e => e.IsRevoked);
                entity.Ignore(e => e.IsActive);

                entity.HasIndex(r => r.Token);

                entity.HasIndex(r => r.UserId);
            });

            modelBuilder.Entity<RsaKey>()
                .HasIndex(k => new { k.IsActive, k.ExpiresOn });

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            DisableCascadeDelete(modelBuilder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            int result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

            if (_dispatcher == null) return result;

            await DispatchEvent();

            if (_user == null) return result;

            UpdateEntities();

            return result;
        }

        public override int SaveChanges()
        {
            return SaveChangesAsync().GetAwaiter().GetResult();
        }

        public async Task DispatchEvent()
        {
            var entitiesWithEvents = ChangeTracker.Entries<BaseEntity>()
                .Select(e => e.Entity)
                .Where(e => e.DomainEvents.Any())
                .ToArray();

            await _dispatcher.DispatchAndClearEvents(entitiesWithEvents);
        }

        public void UpdateEntities()
        {
            foreach (var entry in ChangeTracker.Entries<BaseAuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedBy = _user.Id;
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Added || entry.State == EntityState.Modified ||
                    entry.References.Any(r =>
                        r.TargetEntry != null &&
                        r.TargetEntry.Metadata.IsOwned() &&
                        (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified)))
                {
                    entry.Entity.UpdatedBy = _user.Id;
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
                }
            }
        }

        public static void DisableCascadeDelete(ModelBuilder builder)
        {
            var entityTypes = builder.Model.GetEntityTypes().ToList();
            var foreignKeys = entityTypes
            .SelectMany(e => e.GetForeignKeys().Where(f => f.DeleteBehavior == DeleteBehavior.Cascade));
            foreach (var foreignKey in foreignKeys)
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
        {
            public ApplicationDbContext CreateDbContext(string[] args)
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true)
                    .Build();

                var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                    .UseSqlServer(config.GetConnectionString("DefaultConnection"))
                    .Options;

                return new ApplicationDbContext(options, null!, null!);
            }
        }
    }
}