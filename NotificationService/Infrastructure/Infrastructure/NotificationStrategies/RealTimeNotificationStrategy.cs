namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class RealTimeNotificationStrategy : INotificationStrategy
    {
        public async Task<Result<string>> ExecuteAsync(NotificationRequest request)
        {
            return Result<string>.SuccessResult("Real-time notification sent successfully");
        }
    }
}
