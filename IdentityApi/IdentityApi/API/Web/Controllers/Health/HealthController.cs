namespace Web.Controllers.Health
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.Extensions.Diagnostics.HealthChecks;

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
        /// <summary>
        /// Controller for testing all dependencies
        /// </summary>
        /// <remarks>Test all dependencies using tasks.</remarks>
        /// <response code="200">Success</response>
        /// <response code="400">Invalid or missing data supplied</response>
        /// <response code="500">Internal Server error</response>
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
