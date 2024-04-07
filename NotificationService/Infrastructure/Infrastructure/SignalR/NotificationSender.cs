namespace Infrastructure.SignalR
{
    using Microsoft.AspNetCore.SignalR;

    using Application.Interfaces.Notification;

    using Shared.Notification;

    public class NotificationSender : INotificationSender
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationSender(IHubContext<NotificationHub> notificationHubContext) 
        {
            _notificationHubContext = notificationHubContext;
        }

        public Task BroadcastAsync(INotificationMessage notification, CancellationToken cancellationToken) 
        {
            return _notificationHubContext.Clients.All
                    .SendAsync("NotificationFromServer", notification.GetType().FullName, notification, cancellationToken);
        }

        public Task BroadcastAsync(INotificationMessage notification, IEnumerable<string> excludedConnectionIds, CancellationToken cancellationToken) 
        {
            return _notificationHubContext.Clients.AllExcept(excludedConnectionIds)
                    .SendAsync("NotificationFromServer", notification.GetType().FullName, notification, cancellationToken);
        }

        public Task SendToGroupAsync(INotificationMessage notification, string group, CancellationToken cancellationToken) {
            return _notificationHubContext.Clients.Group(group)
                    .SendAsync("NotificationFromServer", notification.GetType().FullName, notification, cancellationToken);
        }

        public Task SendToUsersAsync(INotificationMessage notification, IEnumerable<string> userIds, CancellationToken cancellationToken) {
            return _notificationHubContext.Clients.Users(userIds)
                    .SendAsync("NotificationFromServer", notification.GetType().FullName, notification, cancellationToken);
        }
    }
}