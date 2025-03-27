namespace Application.Interfaces.Identity
{
    using System.Threading.Tasks;

    using Models.Identity;

    using Application.Handlers.Identity.Commands.Register;

    using Shared;
    
    using Domain.Entities.Identity;

    public interface IIdentity
    {
        // User registration and authentication
        Task<Result<string>> Register(UserRegisterRequestModel userRequest);
        Task<Result<UserResponseModel>> Login(UserRequestModel userRequest);
        Task<Result<UserResponseModel>> RefreshTokenAsync(string refreshToken);
        Task<Result<string>> LogoutAsync(string userEmail);

        // Email verification
        Task<Result<string>> ConfirmEmail(string userEmail, string code, string otp = null);
        Task<Result<string>> SendVerificationEmailAsync(string email, string origin);
        Task<string> GetEmailVerificationUriAsync(User user, string origin);

        // Account management
        Task<Result<string>> UnlockUserAccount(string userEmail);
        Task<Result<string>> LockUserAccount(string userId, DateTimeOffset? endDate = null);

        // Two-factor authentication
        Task<Result<string>> EnableTwoFactorAuthentication(string userEmail);
        Task<Result<string>> DisableTwoFactorAuthentication(string userEmail);
        Task<Result<TwoFactorCodeResult>> Generate2FACodeAsync(string userId);
        Task<Result<UserResponseModel>> Verify2FACode(string userId, string code, string transactionId);
    }
}