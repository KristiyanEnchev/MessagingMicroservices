namespace Infrastructure.PostServices
{
    using System.Net.Http.Json;

    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;

    using Application.Interfaces.Post;

    using Models.Settings.Post;

    using Shared;

    public class SmsService : ISmsService
    {
        private readonly HttpClient _httpClient;
        private readonly SmsSettings _settings;
        private readonly ILogger<SmsService> _logger;

        public SmsService(HttpClient httpClient, IOptions<SmsSettings> settings, ILogger<SmsService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<Result<bool>> SendSmsAsync(string to, string message)
        {
            var request = new SendSmsRequest
            {
                To = to,
                Message = message,
                SmsProvider = _settings.SmsProvider,
            };

            try
            {
                var httpResponse = await _httpClient.PostAsJsonAsync(_settings.SMSCustomPath, request);

                if (httpResponse.Content.Headers.ContentType?.MediaType == "application/json")
                {
                    var response = await httpResponse.Content.ReadFromJsonAsync<SmsResponse>();

                    if (httpResponse.IsSuccessStatusCode && response?.Success == true)
                    {
                        return Result<bool>.SuccessResult(true);
                    }

                    return Result<bool>.Failure(response?.Errors ?? "Unknown SMS sending error");
                }
                else
                {
                    var rawError = await httpResponse.Content.ReadAsStringAsync();
                    _logger.LogError("Unexpected response content from SMS provider: {Content}", rawError);
                    return Result<bool>.Failure("Invalid SMS service response format.");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HttpRequestException while sending SMS to {Recipient}", to);
                return Result<bool>.Failure("SMS delivery failed due to a network issue.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected exception in SmsService");
                return Result<bool>.Failure("An unexpected error occurred while sending SMS.");
            }
        }

        public async Task<Result<bool>> SendOtpSmsAsync(string to, string otp)
        {
            string message = $"""
                Your OTP code is: {otp}. It will expire in 10 minutes.
                If you didn't request this code, please ignore this message.
                """;

            return await SendSmsAsync(to, message);
        }
    }

    public class SmsResponse
    {
        public bool Success { get; set; }
        public string? Data { get; set; }
        public string? Errors { get; set; }
    }

    public class SendSmsRequest
    {
        public string To { get; set; } = default!;
        public string SmsProvider { get; set; }
        public string Message { get; set; } = default!;
    }
}