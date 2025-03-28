namespace Application.Interfaces.Post
{
    using Shared;

    public interface IOtpService
    {
        Task<Result<(string Otp, string TransactionId)>> GenerateOtpAsync(string userId, string purpose);
        Task<Result<bool>> ValidateOtpAsync(string transactionId, string otp, string userId);
    }
}