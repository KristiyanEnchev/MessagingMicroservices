namespace Infrastructure
{
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using Application.Interfaces.Services;

    using Infrastructure.Templating;
    using Infrastructure.SMTP;
    using SendGrid.Helpers.Mail;

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
                .AddTransient<ISMTPService, SMTPService>();

            return services;
        }
       
        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<MailSettings>(configuration.GetSection(nameof(MailSettings)));

            return services;
        }
    }
}