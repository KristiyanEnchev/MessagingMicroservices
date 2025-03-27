namespace Application.Interfaces.Identity
{
    using System.Threading.Tasks;
    
    using Domain.Entities.Identity;

    public interface IRefreshTokenService
    {
        Task<string> GenerateRefreshTokenAsync(User user);
        Task<User> ValidateRefreshTokenAsync(string token);
        Task RevokeAllUserRefreshTokensAsync(string userId);
        Task<bool> IsTokenRevokedAsync(string token);
        Task RevokeTokenAsync(string token, string reason = null);
        Task CleanupExpiredTokensAsync();
    }
}