namespace Models.Notification
{
    public class EventBusOptions
    {
        public string HostName { get; set; }
        public int Port { get; set; }
        public int RetryCount { get; set; }
        public NotificationListenerSettings NotificationListenerSettings { get; set; }
    }

    public class NotificationListenerSettings
    {
        public List<string> Priorities { get; set; }
    }
}
