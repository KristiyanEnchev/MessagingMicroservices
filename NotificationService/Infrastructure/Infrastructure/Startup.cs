namespace Infrastructure
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using global::RabbitMQ.Client;

    using Infrastructure.RabbitMQ;
    using Infrastructure.SignalR;
    using Infrastructure.NotificationFactory;
    using Infrastructure.NotificationStrategies;

    using Application.Interfaces.Notification;

    using Models.Notification;

    public static class Startup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddConfigurations(configuration)
                .AddServices(configuration);

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IMediator, Mediator>();
            services.AddRabbitMqEventBus(configuration);
            services.AddHostedService<RabbitMQListener>();
            services.AddTransient<INotificationSender, NotificationSender>();
            services.AddScoped<INotificationStrategy, PushNotificationStrategy>();
            services.AddScoped<INotificationStrategy, ScheduledNotificationStrategy>();
            services.AddScoped<INotificationStrategyFactory, NotificationStrategyFactory>();

            return services;
        }

        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EventBusOptions>(configuration.GetSection("EventBus"));

            return services;
        }

        public static IServiceCollection AddRabbitMqEventBus(this IServiceCollection services, IConfiguration configuration)
        {
            var factory = new ConnectionFactory()
            {
                HostName = configuration["EventBus:HostName"],
                UserName = configuration.GetValue<string>("EventBus:UserName"),
                Password = configuration.GetValue<string>("EventBus:Password"),
                DispatchConsumersAsync = true
            };

            var port = configuration.GetValue<int?>("EventBus:Port");
            if (port.HasValue)
            {
                factory.Port = port.Value;
            }

            services.AddSingleton<IConnectionFactory>(factory);
            services.AddSingleton<RabbitMQPersistentConnection>();
            services.AddSingleton<IEventBus, RabbitMQEventBus>();

            return services;
        }
    }
}