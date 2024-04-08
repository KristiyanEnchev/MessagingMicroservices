namespace Models.Notification
{
    using Models.Notification.Enums;

    using Shared.Notification;

    public class BasicNotification : INotificationMessage
    {
        public string? Message { get; set; }
        public Status Label { get; set; }
    }
}
