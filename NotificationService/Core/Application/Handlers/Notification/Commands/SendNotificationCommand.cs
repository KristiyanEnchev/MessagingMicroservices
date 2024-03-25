namespace Application.Handlers.Notification.Commands
{
    using MediatR;

    using Models.Notification;

    using Application.Interfaces.Notification;

    using Shared;

    public class SendNotificationCommand : NotificationRequest, IRequest<Result<string>>
    {
        public class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, Result<string>>
        {
            private readonly INotificationStrategyFactory _strategyFactory;

            public SendNotificationCommandHandler(INotificationStrategyFactory strategyFactory)
            {
                _strategyFactory = strategyFactory;
            }

            public async Task<Result<string>> Handle(SendNotificationCommand command, CancellationToken cancellationToken)
            {
                var strategy = _strategyFactory.GetStrategy(command.Type.ToString());
                return await strategy.ExecuteAsync(command);
            }
        }
    }
}