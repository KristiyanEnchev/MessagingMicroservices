//namespace Infrastructure.NotificationStrategies
//{
//    using Application.Interfaces.Notification;

//    using Models.Notification;

//    using Shared;

//    public class EventNotificationStrategy : INotificationStrategy
//    {
//        private readonly IEventBus _eventBus;

//        public EventNotificationStrategy(IEventBus eventBus)
//        {
//            _eventBus = eventBus;
//        }

//        public Task ExecuteAsync(NotificationRequest request)
//        {
//            // Logic to format the message and publish it to the client_notification_exchange
//            var @event = new ClientNotificationEvent { Message = request.Message };
//            _eventBus.Publish(@event, request); // Adjust Publish method to accommodate this use case

//            return Task.CompletedTask;
//        }
//    }
//}
