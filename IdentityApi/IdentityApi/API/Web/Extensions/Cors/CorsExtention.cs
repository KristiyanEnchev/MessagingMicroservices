namespace Web.Extensions.Cors
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using Models.Settings.Cors;

    internal static class CorsExtension
    {
        internal static IServiceCollection AddCustomCorsPolicy(this IServiceCollection services, IConfiguration configuration)
        {
            var swaggerSettings = configuration.GetSection(nameof(CorsSettings)).Get<CorsSettings>()!;

            if (swaggerSettings == null)
            {
                return services;
            }

            var origins = swaggerSettings.Origins!.Split(';', StringSplitOptions.RemoveEmptyEntries);

            services.AddCors(opt =>
                opt.AddPolicy(swaggerSettings.Policy!, policy =>
                    policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins(origins)));

            return services;
        }

        internal static IApplicationBuilder UseCustomCorsPolicy(this IApplicationBuilder app, IConfiguration configuration)
        {
            var swaggerSettings = configuration.GetSection(nameof(CorsSettings)).Get<CorsSettings>()!;

            return app.UseCors(swaggerSettings.Policy!);
        }
    }
}