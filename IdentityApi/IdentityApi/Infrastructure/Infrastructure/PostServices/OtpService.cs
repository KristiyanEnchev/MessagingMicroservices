namespace Infrastructure.PostServices
{
    using System.Net.Http.Json;

    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;

    using Application.Interfaces.Post;

    using Models.Settings.Post;

    using Shared;

    public class OtpService : IOtpService
    {
        private readonly HttpClient _httpClient;
        private readonly OtpSettings _settings;
        private readonly ILogger<OtpService> _logger;

        public OtpService(HttpClient httpClient, IOptions<OtpSettings> settings, ILogger<OtpService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<Result<(string Otp, string TransactionId)>> GenerateOtpAsync(string userId, string purpose)
        {
            try
            {
                var path = $"{_settings.GeneratePath}?digits=true&size=6";
                var request = new
                {
                    identifier = userId,
                    expirationMinutes = (int)(TimeSpan.FromMinutes(_settings.OtpExpiryInMinutes)).TotalMinutes
                };

                var response = await _httpClient.PostAsJsonAsync(path, request);
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<OtpApiResponse>();
                    if (result?.Success == true && result.Data is not null)
                    {
                        return Result<(string, string)>.SuccessResult((result.Data.Otp, result.Data.TransactionId));
                    }

                    return Result<(string, string)>.Failure("Failed to parse OTP response.");
                }

                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("OTP Generation failed for {Purpose}: {Error}", purpose, error);
                return Result<(string, string)>.Failure("OTP generation failed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating OTP");
                return Result<(string, string)>.Failure("Unexpected error occurred while generating OTP.");
            }
        }

        public async Task<Result<bool>> ValidateOtpAsync(string transactionId, string otp, string userId)
        {
            try
            {
                var request = new OtpValidaterequest
                {
                    Otp = otp,
                    Identifier = userId,
                    TransactionId = transactionId,
                };

                var response = await _httpClient.PostAsJsonAsync(_settings.ValidatePath, request);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<OtpValidateResponse>();
                    return Result<bool>.SuccessResult(result?.Valid ?? false);
                }

                var raw = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("OTP validation failed: {Response}", raw);
                return Result<bool>.Failure("Invalid OTP or expired transaction.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating OTP");
                return Result<bool>.Failure("Unexpected error occurred during OTP validation.");
            }
        }

        private class OtpValidaterequest 
        {
            public string TransactionId { get; set; }
            public string Otp { get; set; }
            public string Identifier { get; set; }
        }

        private class OtpApiResponse
        {
            public bool Success { get; set; }
            public OtpData Data { get; set; } = new();
            public object? Errors { get; set; }
        }

        private class OtpData
        {
            public string Otp { get; set; } = string.Empty;
            public string TransactionId { get; set; } = string.Empty;
        }

        private class OtpValidateResponse
        {
            public bool Valid { get; set; }
        }
    }
}