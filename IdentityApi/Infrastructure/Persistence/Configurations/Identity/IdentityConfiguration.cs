namespace Persistence.Configurations.Identity
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    using Domain.Entities.Identity;

    public class IdentityConfiguration
    {
        public class ApplicationUserConfig : IEntityTypeConfiguration<User>
        {
            public void Configure(EntityTypeBuilder<User> builder)
            {
                builder
                    .ToTable("Users", "Identity");

                builder
                    .Property(u => u.Id)
                        .HasMaxLength(256);
            }
        }

        public class ApplicationRoleConfig : IEntityTypeConfiguration<UserRole>
        {
            public void Configure(EntityTypeBuilder<UserRole> builder) =>
                builder
                    .ToTable("Roles", "Identity");
        }

        public class ApplicationRoleClaimConfig : IEntityTypeConfiguration<RoleClaim>
        {
            public void Configure(EntityTypeBuilder<RoleClaim> builder) =>
                builder
                    .ToTable("RoleClaims", "Identity");
        }

        public class IdentityUserRoleConfig : IEntityTypeConfiguration<IdentityUserRole<string>>
        {
            public void Configure(EntityTypeBuilder<IdentityUserRole<string>> builder) =>
                builder
                    .ToTable("UserRoles", "Identity");
        }

        public class IdentityUserClaimConfig : IEntityTypeConfiguration<IdentityUserClaim<string>>
        {
            public void Configure(EntityTypeBuilder<IdentityUserClaim<string>> builder) =>
                builder
                    .ToTable("UserClaims", "Identity");
        }

        public class IdentityUserLoginConfig : IEntityTypeConfiguration<IdentityUserLogin<string>>
        {
            public void Configure(EntityTypeBuilder<IdentityUserLogin<string>> builder) =>
                builder
                    .ToTable("UserLogins", "Identity");
        }

        public class IdentityUserTokenConfig : IEntityTypeConfiguration<IdentityUserToken<string>>
        {
            public void Configure(EntityTypeBuilder<IdentityUserToken<string>> builder) =>
                builder
                    .ToTable("UserTokens", "Identity");
        }
    }
}