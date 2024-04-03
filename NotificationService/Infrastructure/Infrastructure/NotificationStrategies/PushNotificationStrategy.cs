namespace Infrastructure.NotificationStrategies
{
    using Application.Interfaces.Notification;

    using Models.Notification;

    using Shared;

    public class PushNotificationStrategy : INotificationStrategy
    {
        private readonly INotificationSender _notificationSender;
        private readonly IEventBus _eventBus;

        public PushNotificationStrategy(INotificationSender notificationSender, IEventBus eventBus)
        {
            _notificationSender = notificationSender;
            _eventBus = eventBus;
        }

        public async Task<Result<string>> ExecuteAsync(NotificationRequest request, CancellationToken cancellationToken)
        {
            if (request.TargetAudiences is not null && request.TargetAudiences.Count() > 0)
            {
                await _notificationSender
                    .SendToUsersAsync(
                        new BasicNotification
                        {
                            Message = request.Message,
                            Label = request.Label
                        },
                        request.TargetAudiences,
                        cancellationToken
                    );

                _eventBus.Publish(new PushNotificationEvent { Result = Result<string>.SuccessResult("Notification send to user.") }, request);
            }
            else if (request.ClientId != null)
            {
                await _notificationSender
                    .SendToGroupAsync(
                        new PushNotification
                        {
                            Message = request.Message,
                            Activate = request.Activate
                        },
                        request.ClientId!,
                        cancellationToken
                    );

                _eventBus.Publish(new PushNotificationEvent { Result = Result<string>.SuccessResult($"Push Notification send to Client {request.ClientId}.") }, request);
            }

            return Result<string>.SuccessResult("Notification sent successfully");
        }

        public class PushNotificationEvent() : IntegrationEvent
        {
            public Result<string> Result { get; set; }
        }
    }
}
