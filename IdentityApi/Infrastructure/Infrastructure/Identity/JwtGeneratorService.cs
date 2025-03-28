namespace Infrastructure.Identity
{
    using System;
    using System.Threading.Tasks;
    using System.Security.Claims;
    using System.Security.Cryptography;
    using System.IdentityModel.Tokens.Jwt;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;
    using Microsoft.IdentityModel.Tokens;

    using Domain.Entities.Identity;

    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Models.Settings;
    using Models.Identity;

    internal class JwtGeneratorService : IJwtGenerator
    {
        private readonly IDateTimeService _dateTime;
        private readonly UserManager<User> _userManager;
        private readonly ApplicationSettings _applicationSettings;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IRsaKeyService _rsaKeyService;
        private readonly ILogger<JwtGeneratorService> _logger;

        public JwtGeneratorService(
            IDateTimeService dateTime,
            UserManager<User> userManager,
            IOptions<ApplicationSettings> applicationSettings,
            IRefreshTokenService refreshTokenService,
            IRsaKeyService rsaKeyService,
            ILogger<JwtGeneratorService> logger)
        {
            _dateTime = dateTime;
            _userManager = userManager;
            _applicationSettings = applicationSettings.Value;
            _refreshTokenService = refreshTokenService;
            _rsaKeyService = rsaKeyService;
            _logger = logger;
        }

        public async Task<UserResponseModel> GenerateToken(User user)
        {
            var accessToken = await GenerateAccessToken(user);
            var refreshToken = await _refreshTokenService.GenerateRefreshTokenAsync(user);
            var expiryTime = _dateTime.NowUtc.AddMinutes(_applicationSettings.AccessTokenExpirationInMinutes);

            var tokenResult = new UserResponseModel(accessToken, expiryTime, refreshToken);
            return tokenResult;
        }

        public async Task<User> ValidateRefreshToken(string refreshToken)
        {
            return await _refreshTokenService.ValidateRefreshTokenAsync(refreshToken);
        }

        public async Task RemoveAuthenticationToken(User user)
        {
            await _refreshTokenService.RevokeAllUserRefreshTokensAsync(user.Id);
        }

        public async Task<string> GenerateAccessToken(User user)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenExpirationMinutes = _applicationSettings.AccessTokenExpirationInMinutes > 0 
                    ? _applicationSettings.AccessTokenExpirationInMinutes 
                    : 60; // Default 60 minutes
                
                var activeKey = await _rsaKeyService.GetActiveKeyAsync();
                if (activeKey == null)
                {
                    throw new InvalidOperationException("No active RSA key available for token signing");
                }
                
                var rsa = RSA.Create();
                rsa.ImportRSAPrivateKey(Convert.FromBase64String(activeKey.PrivateKey), out _);

                var rsaKey = new RsaSecurityKey(rsa)
                {
                    KeyId = activeKey.Id
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = await CreateClaimsIdentity(user),
                    Expires = _dateTime.NowUtc.AddMinutes(tokenExpirationMinutes),
                    SigningCredentials = new SigningCredentials(
                        rsaKey,
                        SecurityAlgorithms.RsaSha256),
                    Issuer = _applicationSettings.Issuer,
                    Audience = _applicationSettings.Audience,
                    NotBefore = _dateTime.NowUtc
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                _logger.LogInformation("Generated JWT token for user: {UserId}, Expires: {ExpiryTime}", 
                    user.Id, tokenDescriptor.Expires);
                    
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating JWT token for user {UserId}", user.Id);
                throw new InvalidOperationException("Failed to generate JWT access token", ex);
            }
        }

        private async Task<ClaimsIdentity> CreateClaimsIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName ?? string.Empty),
                new Claim(ClaimTypes.Surname, user.LastName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return new ClaimsIdentity(claims);
        }
    }
}