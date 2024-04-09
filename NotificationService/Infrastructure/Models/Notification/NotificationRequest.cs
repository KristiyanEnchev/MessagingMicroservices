namespace Models.Notification
{
    using Models.Notification.Enums;

    using Shared.Notification;

    public class NotificationRequest : INotificationMessage
    {
        public string? ClientId { get; set; }
        public StrategyType Type { get; set; }
        public Priority Priority { get; set; } = Priority.Low;
        public string? Message { get; set; }
        public List<string>? TargetAudiences { get; set; }
        public Status Label { get; set; } = Status.Information;
        public bool Activate { get; set; } = true;
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset EndDate { get; set; }
        public string? TargetArea { get; set; }
        //public List<string>? TargetAreas { get; set; }
    }
}