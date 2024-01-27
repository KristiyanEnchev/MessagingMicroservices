namespace Web.Extentions.Healtchecks
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Serialization;

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

            var jsonResponse = JsonConvert.SerializeObject(response, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                NullValueHandling = NullValueHandling.Ignore,
                Converters = new List<JsonConverter>
                {
                    new StringEnumConverter() { CamelCaseText = true }
                }
            });
            httpContext.Response.ContentType = "application/json";

            if (result.Status != HealthStatus.Healthy)
            {
                httpContext.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            }

            return httpContext.Response.WriteAsync(jsonResponse);
        }
    }
}
