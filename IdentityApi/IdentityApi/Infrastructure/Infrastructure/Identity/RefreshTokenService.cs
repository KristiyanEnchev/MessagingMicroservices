namespace Infrastructure.Identity
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Security.Cryptography;

    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Options;

    using Domain.Entities.Identity;

    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Persistence.Contexts;

    using Shared.Exceptions;

    using Models.Settings;

    internal class RefreshTokenService : IRefreshTokenService
    {
        private const string InvalidToken = "Invalid refresh token!";
        private const string TokenRevoked = "Token has been revoked!";
        private const string TokenExpired = "Token has expired!";

        private readonly ApplicationDbContext _dbContext;
        private readonly IDateTimeService _dateTimeService;
        private readonly IIpAddressService _ipAddressService;
        private readonly ApplicationSettings _applicationSettings;

        public RefreshTokenService(
            ApplicationDbContext dbContext,
            IDateTimeService dateTimeService,
            IOptions<ApplicationSettings> applicationSettings,
            IIpAddressService ipAddressService)
        {
            _dbContext = dbContext;
            _dateTimeService = dateTimeService;
            _applicationSettings = applicationSettings.Value;
            _ipAddressService = ipAddressService;
        }

        public async Task<string> GenerateRefreshTokenAsync(User user)
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            string token = Convert.ToBase64String(randomBytes);

            var expiryDate = _dateTimeService.NowUtc.AddDays(_applicationSettings.RefreshTokenExpirationInDays);

            var refreshToken = new RefreshToken
            {
                Token = token,
                UserId = user.Id,
                ExpiryDate = expiryDate,
                CreatedDate = _dateTimeService.NowUtc,
                CreatedByIp = _ipAddressService.GetCurrentIpAddress()
            };

            _dbContext.RefreshTokens.Add(refreshToken);
            await _dbContext.SaveChangesAsync();

            return token;
        }

        public async Task<User> ValidateRefreshTokenAsync(string token)
        {
            var refreshToken = await _dbContext.RefreshTokens
                .Include(r => r.User)
                .SingleOrDefaultAsync(r => r.Token == token);

            if (refreshToken == null)
            {
                throw new CustomException(InvalidToken, null, System.Net.HttpStatusCode.Unauthorized);
            }

            if (refreshToken.RevokedDate.HasValue)
            {
                throw new CustomException(TokenRevoked, null, System.Net.HttpStatusCode.Unauthorized);
            }

            if (refreshToken.ExpiryDate < _dateTimeService.NowUtc)
            {
                throw new CustomException(TokenExpired, null, System.Net.HttpStatusCode.Unauthorized);
            }

            if (refreshToken.User == null)
            {
                throw new CustomException(InvalidToken, null, System.Net.HttpStatusCode.Unauthorized);
            }

            return refreshToken.User;
        }

        public async Task<bool> IsTokenRevokedAsync(string token)
        {
            return await _dbContext.RefreshTokens
                .AnyAsync(t => t.Token == token && t.IsRevoked);
        }

        public async Task RevokeAllUserRefreshTokensAsync(string userId)
        {
            var userTokens = await _dbContext.RefreshTokens
                .Where(t => t.UserId == userId && !t.RevokedDate.HasValue)
                .ToListAsync();

            foreach (var token in userTokens)
            {
                token.RevokedDate = _dateTimeService.NowUtc;
                token.RevokedByIp = _ipAddressService.GetCurrentIpAddress();
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task RevokeTokenAsync(string token, string reason = null)
        {
            var refreshToken = await _dbContext.RefreshTokens
                .SingleOrDefaultAsync(r => r.Token == token);

            if (refreshToken == null)
            {
                return;
            }

            refreshToken.RevokedDate = _dateTimeService.NowUtc;
            refreshToken.RevokedByIp = _ipAddressService.GetCurrentIpAddress();
            refreshToken.ReasonRevoked = reason;

            await _dbContext.SaveChangesAsync();
        }

        public async Task CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _dbContext.RefreshTokens
                .Where(t => t.ExpiryDate < _dateTimeService.NowUtc)
                .ToListAsync();

            _dbContext.RefreshTokens.RemoveRange(expiredTokens);
            await _dbContext.SaveChangesAsync();
        }
    }
}