namespace Models.Notification
{
    using Shared.Notification;

    public class PushNotification : INotificationMessage
    {
        public string? Message { get; set; }
        public bool Activate { get; set; } = true;
    }
}