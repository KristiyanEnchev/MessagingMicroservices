namespace Models.Notification
{
    public class ScheduledNotificationRequest : NotificationRequest
    {
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
    }
}