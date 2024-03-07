namespace Infrastructure
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;
    using System.Security.Cryptography;
    using Infrastructure.OneTimePin;
    using Application.Interfaces.OneTimePin;

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

            services
                .AddSingleton<RandomNumberGenerator>(RandomNumberGenerator.Create());

            services
                .AddSingleton<RandomGenerator>();

            services.AddScoped<IOneTimePinService, OneTimePinService>();

            return services;
        }

       
        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            return services;
        }
    }
}