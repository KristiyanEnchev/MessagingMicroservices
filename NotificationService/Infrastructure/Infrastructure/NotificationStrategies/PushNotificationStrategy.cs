namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class PushNotificationStrategy : INotificationStrategy
    {
        public async Task<Result<string>> ExecuteAsync(NotificationRequest request)
        {
            return Result<string>.SuccessResult("Successfull notification send.");
        }
    }
}
