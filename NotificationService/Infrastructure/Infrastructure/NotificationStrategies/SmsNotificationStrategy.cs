namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class SmsNotificationStrategy : INotificationStrategy
    {
        public async Task<Result<string>> ExecuteAsync(NotificationRequest request)
        {
            return Result<string>.SuccessResult("SMS sent successfully");
        }
    }
}
