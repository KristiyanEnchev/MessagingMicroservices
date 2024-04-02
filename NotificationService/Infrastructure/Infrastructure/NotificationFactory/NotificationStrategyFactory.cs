namespace Infrastructure.NotificationFactory
{
    using Microsoft.Extensions.DependencyInjection;

    using Application.Interfaces.Notification;

    public class NotificationStrategyFactory : INotificationStrategyFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public NotificationStrategyFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public INotificationStrategy GetStrategy(string type)
        {
            var strategies = _serviceProvider.GetServices<INotificationStrategy>();

            var strategy = strategies.FirstOrDefault(s =>
                s.GetType().Name.StartsWith(type, StringComparison.OrdinalIgnoreCase));

            if (strategy == null)
            {
                throw new ArgumentException($"Unsupported notification type: {type}");
            }

            return strategy;
        }

        //public INotificationStrategy GetStrategy(StrategyType type)
        //{
        //    return type switch
        //    {
        //        StrategyType.Push => _serviceProvider.GetRequiredService<PushNotificationStrategy>(),
        //        StrategyType.Scheduled => _serviceProvider.GetRequiredService<ScheduledNotificationStrategy>(),
        //        _ => throw new ArgumentException("Invalid notification type", nameof(type)),
        //    };
        //}
    }
}
