namespace Infrastructure.Services
{
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.DependencyInjection;

    using Application.Interfaces.Identity;

    public class TokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<TokenCleanupService> _logger;

        public TokenCleanupService(
            IServiceProvider serviceProvider,
            ILogger<TokenCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Token Cleanup Service running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromDays(1), stoppingToken);

                    using var scope = _serviceProvider.CreateScope();
                    var refreshTokenService = scope.ServiceProvider.GetRequiredService<IRefreshTokenService>();

                    _logger.LogInformation("Cleaning up expired tokens...");
                    await refreshTokenService.CleanupExpiredTokensAsync();
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during token cleanup");
                }
            }
        }
    }
}
