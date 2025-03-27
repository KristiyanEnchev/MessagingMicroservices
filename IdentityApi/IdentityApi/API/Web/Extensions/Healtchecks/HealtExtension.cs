namespace Web.Extensions.Healtchecks
{
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Diagnostics.HealthChecks;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;

    using Models.HealthCheck;

    internal static class HealtExtension
    {
        internal static IServiceCollection AddHealth(this IServiceCollection services, IConfiguration configuration)
        {
            var healtSettings = configuration.GetSection(nameof(Health)).Get<Health>();

            services.AddSingleton<CustomHealthCheckResponseWriter>();

            var databaseHealthChecks = healtSettings?.DatabaseHealthChecks;

            var healthChecks = services.AddHealthChecks();

            if (databaseHealthChecks != null && (bool)databaseHealthChecks)
            {
                healthChecks
                    .AddSqlServer(configuration!.GetConnectionString("DefaultConnection")!);
            }

            return services;
        }

        internal static IEndpointConventionBuilder MapHealthCheck(this IEndpointRouteBuilder endpoints) =>
            endpoints.MapHealthChecks("/api/health", new HealthCheckOptions
            {
                ResponseWriter = (httpContext, result) => CustomHealthCheckResponseWriter.WriteResponse(httpContext, result),
            });
    }
}