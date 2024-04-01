namespace Application.Interfaces.Notification
{
    using Models.Notification;

    using Shared;

    public interface INotificationStrategy
    {
        Task<Result<string>> ExecuteAsync(NotificationRequest request, CancellationToken cancellationToken);
    }
}
