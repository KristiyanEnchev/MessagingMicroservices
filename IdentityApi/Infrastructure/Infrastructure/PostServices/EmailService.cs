namespace Infrastructure.PostServices
{
    using System.Net.Http.Json;

    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;

    using Models.Settings.Post;

    using Application.Interfaces.Post;

    public class EmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly EmailSettings _settings;
        private readonly ILogger<OtpService> _logger;

        public EmailService(HttpClient httpClient, IOptions<EmailSettings> settings, ILogger<OtpService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body, string displayName, bool isHtml = true)
        {
            var payload = new
            {
                to = new[] { to },
                subject,
                displayName,
                emailProvider = _settings.EmailProvider,
                body
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync(_settings.EmailCustomPath, payload);

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to send email: {Error}", error);
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SendEmailAsync");
                return false;
            }
        }

        public async Task<bool> SendOtpEmailAsync(string to, string otp)
        {
            string subject = "Your One-Time Password";
            string body = $@"
                <h2>Your One-Time Password</h2>
                <p>Your OTP code is: <strong>{otp}</strong></p>
                <p>This code will expire in 2 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            ";

            return await SendEmailAsync(to, subject, body, "Identity Api OTP request");
        }

        public async Task<bool> SendPasswordResetEmailAsync(string to, string resetLink)
        {
            string subject = "Reset Your Password";
            string body = $@"
                <h2>Reset Your Password</h2>
                <p>Please click the link below to reset your password:</p>
                <p><a href='{resetLink}'>Reset Password</a></p>
                <p>If you didn't request this reset, please ignore this email.</p>
            ";

            return await SendEmailAsync(to, subject, body, "Identity Api Password reset request");
        }

        public async Task<bool> SendVerificationEmailAsync(string to, string verificationLink)
        {
            string subject = "Verify Your Email Address";
            string body = $@"
                <h2>Verify Your Email Address</h2>
                <p>Please click the link below to verify your email address:</p>
                <p><a href='{verificationLink}'>Verify Email</a></p>
                <p>If you didn't request this verification, please ignore this email.</p>
            ";

            return await SendEmailAsync(to, subject, body, "Identity Api Verification Email request");
        }
    }
}