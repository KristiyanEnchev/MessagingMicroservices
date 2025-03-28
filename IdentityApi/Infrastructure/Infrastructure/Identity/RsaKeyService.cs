namespace Infrastructure.Identity
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Security.Cryptography;

    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Domain.Entities.Identity;

    using Persistence.Contexts;

    using Models.Settings;

    public class RsaKeyService : IRsaKeyService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IDateTimeService _dateTimeService;
        private readonly ApplicationSettings _applicationSettings;
        private readonly ILogger<RsaKeyService> _logger;

        public RsaKeyService(
            ApplicationDbContext dbContext,
            IDateTimeService dateTimeService,
            IOptions<ApplicationSettings> applicationSettings,
            ILogger<RsaKeyService> logger)
        {
            _dbContext = dbContext;
            _dateTimeService = dateTimeService;
            _applicationSettings = applicationSettings.Value;
            _logger = logger;
        }

        public async Task<string> GetActivePrivateKeyAsync()
        {
            try
            {
                var activeKey = await _dbContext.RsaKeys
                    .Where(k => k.IsActive && (!k.ExpiresOn.HasValue || k.ExpiresOn.Value > _dateTimeService.NowUtc))
                    .OrderByDescending(k => k.CreatedOn)
                    .FirstOrDefaultAsync();

                if (activeKey == null)
                {
                    _logger.LogWarning("No active RSA key found. Generating a new key pair.");
                    await GenerateNewRsaKeyPairAsync();
                    return await GetActivePrivateKeyAsync();
                }

                return activeKey.PrivateKey;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active RSA private key");
                throw new InvalidOperationException("Failed to retrieve RSA private key for token signing", ex);
            }
        }

        public async Task<string> GetActivePublicKeyAsync()
        {
            try
            {
                var activeKey = await _dbContext.RsaKeys
                    .Where(k => k.IsActive && (!k.ExpiresOn.HasValue || k.ExpiresOn.Value > _dateTimeService.NowUtc))
                    .OrderByDescending(k => k.CreatedOn)
                    .FirstOrDefaultAsync();

                if (activeKey == null)
                {
                    _logger.LogWarning("No active RSA key found for validation");
                    return null;
                }

                return activeKey.PublicKey;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active RSA public key");
                throw new InvalidOperationException("Failed to retrieve RSA public key for token validation", ex);
            }
        }

        public async Task<RsaKey> GenerateNewRsaKeyPairAsync(int keySize = 2048)
        {
            try
            {
                using var rsa = RSA.Create(keySize);
                
                var publicKey = Convert.ToBase64String(rsa.ExportRSAPublicKey());
                var privateKey = Convert.ToBase64String(rsa.ExportRSAPrivateKey());

                // De-activate all current keys
                var activeKeys = await _dbContext.RsaKeys
                    .Where(k => k.IsActive)
                    .ToListAsync();

                foreach (var key in activeKeys)
                {
                    key.IsActive = false;
                }
                
                _logger.LogInformation("Deactivated {Count} existing RSA keys", activeKeys.Count);

                var keyId = Guid.NewGuid().ToString("N");
                var rsaKey = new RsaKey
                {
                    Id = keyId,
                    PublicKey = publicKey,
                    PrivateKey = privateKey,
                    CreatedOn = _dateTimeService.NowUtc,
                    ExpiresOn = _applicationSettings.RsaKeyExpirationInDays > 0 
                        ? _dateTimeService.NowUtc.AddDays(_applicationSettings.RsaKeyExpirationInDays) 
                        : null,
                    IsActive = true
                };

                _dbContext.RsaKeys.Add(rsaKey);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Generated new RSA key pair with ID: {KeyId}", keyId);
                return rsaKey;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating new RSA key pair");
                throw new InvalidOperationException("Failed to generate new RSA key pair", ex);
            }
        }

        public async Task RotateRsaKeysAsync()
        {
            try
            {
                await GenerateNewRsaKeyPairAsync();
                
                // Clean up expired keys
                var expiredKeys = await _dbContext.RsaKeys
                    .Where(k => k.ExpiresOn.HasValue && k.ExpiresOn.Value < _dateTimeService.NowUtc)
                    .ToListAsync();

                _dbContext.RsaKeys.RemoveRange(expiredKeys);
                await _dbContext.SaveChangesAsync();
                
                _logger.LogInformation("Removed {Count} expired RSA keys during rotation", expiredKeys.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error rotating RSA keys");
                throw new InvalidOperationException("Failed to rotate RSA keys", ex);
            }
        }

        public async Task<RsaKey> GetActiveKeyAsync()
        {
            try
            {
                var activeKey = await _dbContext.RsaKeys
                    .Where(k => k.IsActive && (!k.ExpiresOn.HasValue || k.ExpiresOn.Value > _dateTimeService.NowUtc))
                    .OrderByDescending(k => k.CreatedOn)
                    .FirstOrDefaultAsync();

                if (activeKey == null)
                {
                    _logger.LogWarning("No active RSA key found. Generating a new key pair.");
                    return await GenerateNewRsaKeyPairAsync();
                }

                return activeKey;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active RSA key");
                throw new InvalidOperationException("Failed to retrieve active RSA key", ex);
            }
        }
    }
}