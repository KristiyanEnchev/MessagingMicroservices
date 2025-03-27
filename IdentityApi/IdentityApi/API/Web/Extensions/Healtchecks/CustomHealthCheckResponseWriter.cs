namespace Web.Extensions.Healtchecks
{
    using System.Text.Json;
    using System.Text.Json.Serialization;

    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Diagnostics.HealthChecks;

    using Models.HealthCheck;

    internal class CustomHealthCheckResponseWriter
    {
        public static Task WriteResponse(HttpContext httpContext, HealthReport result)
        {
            var response = new HealthResult
            {
                Status = result.Status.ToString(),
                TotalChecks = result.Entries.Count,
                Entries = result.Entries.Select(e => new HealthEntry
                {
                    Name = e.Key,
                    Status = e.Value.Status.ToString(),
                    Duration = e.Value.Duration,
                    Exception = e.Value.Exception?.Message
                }).ToList()
            };

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
            };

            var jsonResponse = JsonSerializer.Serialize(response, jsonOptions);
            httpContext.Response.ContentType = "application/json";

            if (result.Status != HealthStatus.Healthy)
            {
                httpContext.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            }

            return httpContext.Response.WriteAsync(jsonResponse);
        }
    }
}