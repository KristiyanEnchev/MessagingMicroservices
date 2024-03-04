namespace Infrastructure
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using Application.Interfaces.SMS;

    using Infrastructure.Twilio;
    using Infrastructure.Templating;

    using Models.SMS;

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
                .AddTransient<IMediator, Mediator>()
                .AddTransient<ITemplateService, TemplateService>()
                .AddTransient<ITwilioSMSService, TwilioSMSService>();

            return services;
        }
       
        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<TwilioSettings>(configuration.GetSection(nameof(TwilioSettings)));

            return services;
        }
    }
}