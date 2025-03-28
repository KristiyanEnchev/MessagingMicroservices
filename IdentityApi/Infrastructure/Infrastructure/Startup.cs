namespace Infrastructure
{
    using System;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    using Microsoft.Extensions.Options;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using Polly;
    using Polly.Extensions.Http;

    using Application.Interfaces;
    using Application.Interfaces.Post;
    using Application.Interfaces.Account;
    using Application.Interfaces.Identity;

    using Infrastructure.Account;
    using Infrastructure.Identity;
    using Infrastructure.Services;
    using Infrastructure.PostServices;

    using Persistence;
    using Persistence.Contexts;

    using Domain.Events;
    using Domain.Interfaces;
    using Domain.Entities.Identity;

    using Models.Settings.Post;

    public static class Startup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddServices()
                .AddIdentity()
                .AddHttpClients(configuration);

            services.AddPersistence(configuration);

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services
                .AddTransient<IMediator, Mediator>()
                .AddTransient<IDomainEventDispatcher, DomainEventDispatcher>()
                .AddTransient<IDateTimeService, DateTimeService>()
                .AddTransient<IUserService, UserService>()
                .AddScoped<IUserActivityService, UserActivityService>()
                .AddTransient<IEmailService, EmailService>()
                .AddTransient<ISmsService, SmsService>()
                .AddTransient<IOtpService, OtpService>()
                .AddTransient<IIpAddressService, IpAddressService>()
                .AddTransient<IPasswordService, PasswordService>()
                .AddTransient<ICookieService, CookieService>()
                .AddTransient<INotificationService, NotificationService>();

            services.AddHostedService<TokenCleanupService>();

            return services;
        }

        public static async Task InitializeDatabase(this IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

            await initialiser.InitialiseAsync();

            await initialiser.SeedAsync();
        }

        private static IServiceCollection AddIdentity(this IServiceCollection services)
        {
            services
                .AddTransient<IIdentity, IdentityService>()
                .AddTransient<IJwtGenerator, JwtGeneratorService>()
                .AddTransient<IRefreshTokenService, RefreshTokenService>()
                .AddTransient<IRsaKeyService, RsaKeyService>()
                .AddTransient<IRoleService, RoleService>()
                .AddIdentity<User, UserRole>(options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;

                    options.SignIn.RequireConfirmedEmail = true;
                    options.SignIn.RequireConfirmedPhoneNumber = false;

                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
                    options.Lockout.MaxFailedAccessAttempts = 5;
                    options.Lockout.AllowedForNewUsers = true;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            return services;
        }

        private static IServiceCollection AddHttpClients(this IServiceCollection services, IConfiguration configuration)
        {
            // Email Service
            services.AddHttpClient<IEmailService, EmailService>((serviceProvider, client) => {
                var settings = serviceProvider.GetRequiredService<IOptions<EmailSettings>>().Value;
                ConfigureClient(client, settings.ApiBaseUrl, settings.ApiKey);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            // SMS Service
            services.AddHttpClient<ISmsService, SmsService>((serviceProvider, client) => {
                var settings = serviceProvider.GetRequiredService<IOptions<SmsSettings>>().Value;
                ConfigureClient(client, settings.ApiBaseUrl, settings.ApiKey);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            // Notification Service
            services.AddHttpClient<INotificationService, NotificationService>((serviceProvider, client) => {
                var settings = serviceProvider.GetRequiredService<IOptions<NotificationSettings>>().Value;
                ConfigureClient(client, settings.ApiBaseUrl, settings.ApiKey);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            // OTP Service
            services.AddHttpClient<IOtpService, OtpService>((serviceProvider, client) => {
                var settings = serviceProvider.GetRequiredService<IOptions<OtpSettings>>().Value;
                ConfigureClient(client, settings.ApiBaseUrl, settings.ApiKey);
            })
            .AddPolicyHandler(GetRetryPolicy())
            .AddPolicyHandler(GetCircuitBreakerPolicy());

            return services;
        }

        private static void ConfigureClient(HttpClient client, string baseUrl, string apiKey)
        {
            if (!string.IsNullOrEmpty(baseUrl))
            {
                client.BaseAddress = new Uri(baseUrl);
            }
            
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            if (!string.IsNullOrEmpty(apiKey))
            {
                client.DefaultRequestHeaders.Add("X-Api-Key", apiKey);
            }
        }

        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
        }

        private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
        {
            return HttpPolicyExtensions
                .HandleTransientHttpError()
                .CircuitBreakerAsync(5, TimeSpan.FromSeconds(30));
        }
    }
}