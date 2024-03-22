namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class EmailNotificationStrategy : INotificationStrategy
    {
        public async Task<Result<string>> ExecuteAsync(NotificationRequest request)
        {
            return Result<string>.SuccessResult("Email sent successfully");
        }
    }
}
