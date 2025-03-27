namespace Persistence.Contexts
{
    using Microsoft.Extensions.Logging;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;

    using Persistence.Constants;

    using Domain.Entities.Identity;

    using Application.Interfaces.Identity;

    public static class InitialiserExtensions
    {
        public static async Task InitialiseDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
            await initialiser.InitialiseAsync();
            await initialiser.SeedAsync();
        }
    }

    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<UserRole> _roleManager;
        private readonly IRsaKeyService _rsaKeyService;

        public ApplicationDbContextInitialiser(
            ILogger<ApplicationDbContextInitialiser> logger, 
            ApplicationDbContext context, 
            UserManager<User> userManager, 
            RoleManager<UserRole> roleManager,
            IRsaKeyService rsaKeyService)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _rsaKeyService = rsaKeyService;
        }

        public async Task InitialiseAsync()
        {
            try
            {
                await _context.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                await TrySeedAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }

        public async Task TrySeedAsync()
        {
            // Ensure at least one RSA key exists
            await EnsureRsaKeyExistsAsync();
            
            // Create roles if they don't exist
            await SeedRolesAsync();

            // Create admin user if it doesn't exist
            await SeedAdminUserAsync();

            // Create regular test user if it doesn't exist
            await SeedRegularUserAsync();
        }

        private async Task EnsureRsaKeyExistsAsync()
        {
            var hasActiveKey = await _context.RsaKeys.AnyAsync(k => k.IsActive);
            
            if (!hasActiveKey)
            {
                _logger.LogInformation("No active RSA keys found. Generating a new key pair.");
                await _rsaKeyService.GenerateNewRsaKeyPairAsync();
                _logger.LogInformation("Generated new RSA key pair.");
            }
            else
            {
                _logger.LogInformation("Active RSA keys found. No need to generate a new one.");
            }
        }

        private async Task SeedRolesAsync()
        {
            var administratorRole = new UserRole(Roles.Administrator);
            var userRole = new UserRole(Roles.User);

            if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
            {
                await _roleManager.CreateAsync(administratorRole);
                _logger.LogInformation("Created Administrator role.");
            }

            if (_roleManager.Roles.All(r => r.Name != userRole.Name))
            {
                await _roleManager.CreateAsync(userRole);
                _logger.LogInformation("Created User role.");
            }
        }

        private async Task SeedAdminUserAsync()
        {
            var administrator = new User
            {
                UserName = "admin@admin.com",
                FirstName = "Super",
                LastName = "Admin",
                Email = "admin@admin.com",
                IsActive = true,
                CreatedBy = "Initial Seed",
                CreatedDate = DateTime.UtcNow,
                EmailConfirmed = true,
            };

            if (_userManager.Users.All(u => u.UserName != administrator.UserName))
            {
                var result = await _userManager.CreateAsync(administrator, "123456");

                if (result.Succeeded)
                {
                    _logger.LogInformation("Created admin user.");

                    if (!string.IsNullOrWhiteSpace(Roles.Administrator))
                    {
                        await _userManager.AddToRolesAsync(administrator, new[] { Roles.Administrator });
                        _logger.LogInformation("Assigned Administrator role to admin user.");
                    }
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogWarning($"Failed to create admin user: {errors}");
                }
            }
        }

        private async Task SeedRegularUserAsync()
        {
            var regularUser = new User
            {
                UserName = "user@example.com",
                FirstName = "Test",
                LastName = "User",
                Email = "user@example.com",
                IsActive = true,
                CreatedBy = "Initial Seed",
                CreatedDate = DateTime.UtcNow,
                EmailConfirmed = true,
                PhoneNumber = "+1234567890",
                PhoneNumberConfirmed = true
            };

            if (_userManager.Users.All(u => u.UserName != regularUser.UserName))
            {
                var result = await _userManager.CreateAsync(regularUser, "Password123!");

                if (result.Succeeded)
                {
                    _logger.LogInformation("Created regular test user.");

                    if (!string.IsNullOrWhiteSpace(Roles.User))
                    {
                        await _userManager.AddToRolesAsync(regularUser, new[] { Roles.User });
                        _logger.LogInformation("Assigned User role to regular test user.");
                    }
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    _logger.LogWarning($"Failed to create regular test user: {errors}");
                }
            }
        }
    }
}