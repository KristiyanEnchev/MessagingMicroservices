namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class ScheduledNotificationStrategy : INotificationStrategy
    {
        public async Task<Result<string>> ExecuteAsync(NotificationRequest request)
        {
            return Result<string>.SuccessResult("Successfull scheduled notification send.");
        }
    }
}