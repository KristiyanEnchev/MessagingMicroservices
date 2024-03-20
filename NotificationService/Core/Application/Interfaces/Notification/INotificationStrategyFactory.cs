namespace Application.Interfaces.Notification
{
    public interface INotificationStrategyFactory
    {
        INotificationStrategy GetStrategy(string type);
    }
}
