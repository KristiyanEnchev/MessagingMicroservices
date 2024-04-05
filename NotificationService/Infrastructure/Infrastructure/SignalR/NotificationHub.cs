namespace Infrastructure.SignalR
{
    using Microsoft.AspNetCore.SignalR;
    using Microsoft.Extensions.Logging;

    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var clientId = httpContext.Request.Query["clientId"];

            if (!string.IsNullOrEmpty(clientId))
            {
                var groupName = $"Group-{clientId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                _logger.LogInformation($"A client connected to NotificationHub: {Context.ConnectionId} and joined group {groupName}");
            }
            else
            {
                _logger.LogWarning($"A client connected without specifying targetClient or clientId: {Context.ConnectionId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            var clientId = httpContext.Request.Query["clientId"];

            if (!string.IsNullOrEmpty(clientId))
            {
                var groupName = $"Group-{clientId}";
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
                _logger.LogInformation($"A client disconnected to NotificationHub: {Context.ConnectionId} and joined group {groupName}");
            }
            else
            {
                _logger.LogWarning($"A client disconnected without specifying targetClient or clientId: {Context.ConnectionId}");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
