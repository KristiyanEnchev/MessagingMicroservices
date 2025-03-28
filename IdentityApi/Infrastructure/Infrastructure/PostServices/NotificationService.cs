namespace Infrastructure.PostServices
{
    using System.Net.Http.Json;

    using Microsoft.Extensions.Options;
    using Microsoft.Extensions.Logging;

    using Application.Interfaces.Post;

    using Models.Settings.Post;

    public class NotificationService : INotificationService
    {
        private readonly HttpClient _httpClient;
        private readonly NotificationSettings _settings;
        private readonly ILogger<OtpService> _logger;

        public NotificationService(HttpClient httpClient, IOptions<NotificationSettings> settings, ILogger<OtpService> logger)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<bool> SendNotificationAsync(string userId, string title, string message, string type)
        {
            var payload = new SendNotificationCommand
            {
                ClientId = userId,
                Type = "Push",
                Priority = "High",
                Message = message,
                TargetAudiences = new List<string> { userId },
                Label = "Information",
                Activate = true,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(1)
            };

            try
            {
                var response = await _httpClient.PostAsJsonAsync(_settings.NotificationPath, payload);
                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("Notification failed: {Body}", body);
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending notification");
                return false;
            }
        }
    }

    public class SendNotificationCommand
    {
        public string? ClientId { get; set; }
        public string Type { get; set; } // "Push" or "Scheduled"
        public string Priority { get; set; } // "Low" / "Medium" / "High"
        public string Message { get; set; }
        public List<string>? TargetAudiences { get; set; }
        public string Label { get; set; } // "Information" / "Warning" / "Success" / "Error"
        public bool Activate { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? TargetArea { get; set; }
    }
}
