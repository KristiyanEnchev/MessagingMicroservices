namespace Application.Interfaces.Post
{
    using Shared;

    public interface ISmsService
    {
        Task<Result<bool>> SendSmsAsync(string to, string message);
        Task<Result<bool>> SendOtpSmsAsync(string to, string otp);
    }
}