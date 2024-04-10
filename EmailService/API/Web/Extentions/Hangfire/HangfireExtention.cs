namespace Web.Extentions.Hangfire
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using global::Hangfire;
    using global::Hangfire.Redis.StackExchange;

    using Newtonsoft.Json;

    using Web.Extentions.MediatoR;

    public static class HangfireExtention
    {
        public static IServiceCollection AddHangfireConfigurations(this IServiceCollection services, IConfiguration configuration) 
        {
            var redisConnection = configuration.GetConnectionString("Redis");

            services.AddTransient<MediatorHangfireBridge>();
            services.AddSingleton<JobActivator, MailingJobActivator>();

            services.AddHangfire(configuration => configuration
                .UseRedisStorage(redisConnection, new RedisStorageOptions
                {
                    Prefix = "hangfire:Email",
                })
                .UseSerilogLogProvider()
                .UseMediatR());

            services.AddHangfireServer();

            return services;
        }

        private static void UseMediatR(this IGlobalConfiguration configuration)
        {
            var jsonSettings = new JsonSerializerSettings
            {
                TypeNameHandling = TypeNameHandling.All
            };
            configuration.UseSerializerSettings(jsonSettings);
        }

        public static IApplicationBuilder UseHangfireConfiguration(this IApplicationBuilder app) 
        {
            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = new[] 
                {
                    new HangfireCustomBasicAuthenticationFilter("Admin", "password")
                }
            });

            return app;
        }
    }
}
