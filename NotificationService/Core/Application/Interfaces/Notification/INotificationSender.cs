namespace Application.Interfaces.Notification
{
    using Shared.Notification;

    public interface INotificationSender
    {
        Task BroadcastAsync(INotificationMessage notification, CancellationToken cancellationToken);
        Task BroadcastAsync(INotificationMessage notification, IEnumerable<string> excludedConnectionIds, CancellationToken cancellationToken);
        Task SendToGroupAsync(INotificationMessage notification, string group, CancellationToken cancellationToken);
        Task SendToUsersAsync(INotificationMessage notification, IEnumerable<string> userIds, CancellationToken cancellationToken);
    }
}