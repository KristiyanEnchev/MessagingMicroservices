namespace Web.Controllers.Health
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Diagnostics.HealthChecks;

    using Swashbuckle.AspNetCore.Annotations;

    using Models.HealthCheck;

    public class HealthController : ApiController
    {
        private readonly HealthCheckService _healthCheckService;

        public HealthController(HealthCheckService healthCheckService)
        {
            _healthCheckService = healthCheckService;
        }

        [HttpGet]
        [AllowAnonymous]
        [SwaggerResponse(200, "Success")]
        [SwaggerResponse(400, "Invalid or missing data supplied")]
        [SwaggerResponse(500, "Internal Server error")]
        [SwaggerOperation("Controller for testing all dependencies.", "Test all dependencies using tasks.")]
        public async Task<IActionResult> CheckHealth()
        {
            var result = await _healthCheckService.CheckHealthAsync();
            var healthCheckDto = new HealthResult
            {
                Entries = result.Entries.Select(e => new HealthEntry
                {
                    Name = e.Key,
                    Status = e.Value.Status.ToString(),
                    Duration = e.Value.Duration,
                    Exception = e.Value.Exception?.Message
                }).ToList(),
                Status = result.Status.ToString(),
                TotalChecks = result.Entries.Count
            };

            if (result.Status == HealthStatus.Healthy)
            {
                return Ok(healthCheckDto);
            }

            return StatusCode(500, healthCheckDto);
        }
    }
}
