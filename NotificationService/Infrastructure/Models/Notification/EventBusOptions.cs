namespace Models.Notification
{
    public class EventBusOptions
    {
        public string SubscriptionClientName { get; set; }
        public int RetryCount { get; set; } = 5;
    }
}
