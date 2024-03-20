namespace Infrastructure.NotificationFactory
{
    using Application.Interfaces.Notification;

    public class NotificationStrategyFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public NotificationStrategyFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public INotificationStrategy GetStrategy(string type)
        {
            var strategyName = $"{type}NotificationStrategy";
            var strategy = _serviceProvider.GetService(typeof(INotificationStrategy)) as INotificationStrategy;
            if (strategy == null)
            {
                throw new ArgumentException($"Unsupported notification type: {type}");
            }
            return strategy;
        }
    }
}
