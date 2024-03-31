namespace Application.Interfaces.Notification
{
    using Models.Notification;

    public interface IEventBus
    {
        void Publish(IntegrationEvent @event, NotificationRequest notificationRequest);
    }
}