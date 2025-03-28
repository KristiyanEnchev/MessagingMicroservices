namespace Application.Interfaces.Post
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body, string displayName, bool isHtml = true);
        Task<bool> SendVerificationEmailAsync(string to, string verificationLink);
        Task<bool> SendOtpEmailAsync(string to, string otp);
        Task<bool> SendPasswordResetEmailAsync(string to, string resetLink);
    }
}