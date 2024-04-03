namespace Infrastructure.NotificationStrategies
{
    using Microsoft.Extensions.Logging;

    using Hangfire;

    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class ScheduledNotificationStrategy : INotificationStrategy
    {
        private readonly INotificationSender _sender;
        private readonly ILogger<ScheduledNotificationStrategy> _logger;

        public ScheduledNotificationStrategy(INotificationSender sender, ILogger<ScheduledNotificationStrategy> logger)
        {
            _sender = sender;
            _logger = logger;
        }

        public async Task<Result<string>> ExecuteAsync(NotificationRequest request, CancellationToken cancellationToken)
        {
            var jobIdStart = BackgroundJob.Schedule(() => _sender
                    .SendToGroupAsync(
                        new PushNotification
                        {
                            Message = request.Message,
                            Activate = request.Activate,
                        },
                        request.ClientId!,
                        cancellationToken
                    ),
                    request.StartDate
                );

            var jobIdEnd = BackgroundJob.Schedule(() => _sender
                   .SendToGroupAsync(
                       new PushNotification
                       {
                           Message = request.Message,
                           Activate = !request.Activate,
                       },
                       request.ClientId!,
                       cancellationToken
                   ),
                   request.EndDate
               );

            _logger.LogInformation($"Successfull scheduled notification start:{request.StartDate} end:{request.EndDate}");

            return Result<string>.SuccessResult("Successfull scheduled notification send.");
        }
    }
}