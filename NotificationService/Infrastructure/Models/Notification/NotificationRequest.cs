namespace Models.Notification
{
    using Models.Notification.Enums;

    public class NotificationRequest
    {
        public string Message { get; set; }
        public StrategyType Type { get; set; }
        public Status Status { get; set; } = Status.Basic;
        public Priority Priority { get; set; } = Priority.Low;
        public NotificationCategory NotificationCategory { get; set; } = NotificationCategory.Transactional;
        public List<string>? TargetAudiences { get; set; }
        public TargetClient TargetClient { get; set; } = TargetClient.WebApp;
        public string? ClienId { get; set; }
        public List<string>? TargetAreas { get; set; }
    }
}