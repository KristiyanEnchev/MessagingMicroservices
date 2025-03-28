namespace Web
{
    using System.Reflection;

    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using Application;
    using Application.Interfaces;

    using Web.Services;
    using Web.Extentions.Swagger;
    using Web.Extentions.Hangfire;
    using Web.Extentions.Middleware;
    using Web.Extentions.Healtchecks;

    using Infrastructure;

    using Persistence;
    using Web.Extentions.Cors;

    public static class Startup
    {
        public static IServiceCollection AddWeb(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpContextAccessor();
            services.AddControllers().AddApplicationPart(Assembly.GetExecutingAssembly()).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });

            services.AddApplication();
            services.AddInfrastructure(config);
            services.AddPersistence(config);

            services.AddSwaggerDocumentation();
            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddHealth(config);
            services.AddHangfireConfigurations(config);

            services.AddScoped<IUser, CurrentUser>();
            services.AddCustomCorsPolicy(config);

            return services;
        }

        public static async Task InitializeDatabase(this IServiceProvider services, IConfiguration config)
        {
            await services.InitializeDatabaseAsync(config);
        }

        public static IApplicationBuilder UseWeb(this IApplicationBuilder builder, IConfiguration configuration)
        {
            builder.UseSwaggerDocumentation()
                    .UseStaticFiles()
                    .UseHttpsRedirection()
                    .UseErrorHandler()
                    .UseHangfireConfiguration()
                    .UseRouting()
                    .UseAuthentication()
                    .UseCustomCorsPolicy(configuration)
                    .UseAuthorization();

            return builder;
        }

        public static IServiceCollection AddConfigurations(this IServiceCollection services, IWebHostBuilder hostBulder, IWebHostEnvironment env)
        {
            hostBulder.ConfigureAppConfiguration(config =>
            {
                config.SetBasePath(AppDomain.CurrentDomain.BaseDirectory);
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                config.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);
                config.AddEnvironmentVariables();
                config.Build();
            });

            return services;
        }

        public static IEndpointRouteBuilder MapEndpoints(this IEndpointRouteBuilder builder)
        {
            builder.MapControllers();
                //.RequireAuthorization();
            builder.MapHealthCheck();

            return builder;
        }
    }
}