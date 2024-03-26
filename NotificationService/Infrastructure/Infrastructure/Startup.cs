namespace Infrastructure
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using Infrastructure.NotificationFactory;
    using Infrastructure.NotificationStrategies;

    using Application.Interfaces.Notification;

    public static class Startup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddServices()
                .AddConfigurations(configuration);

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services
                .AddTransient<IMediator, Mediator>();

            services.AddScoped<INotificationStrategy, RealTimeNotificationStrategy>();
            services.AddScoped<INotificationStrategy, PushNotificationStrategy>();
            services.AddScoped<INotificationStrategy, ScheduledNotificationStrategy>();
            services.AddScoped<INotificationStrategyFactory, NotificationStrategyFactory>();

            return services;
        }

        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            return services;
        }
    }
}