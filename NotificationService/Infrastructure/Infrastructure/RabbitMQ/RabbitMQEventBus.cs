namespace Infrastructure.RabbitMQ
{
    using System.Text;

    using Newtonsoft.Json;

    using global::RabbitMQ.Client;

    using Application.Interfaces.Notification;

    using Models.Notification;

    public class RabbitMQEventBus : IEventBus
    {
        private readonly RabbitMQPersistentConnection _persistentConnection;
        private readonly string _exchangeName = "notification_event_bus";

        public RabbitMQEventBus(RabbitMQPersistentConnection persistentConnection)
        {
            _persistentConnection = persistentConnection ?? throw new ArgumentNullException(nameof(persistentConnection));
        }

        public void Publish(IntegrationEvent @event, NotificationRequest notificationRequest)
        {
            using var channel = _persistentConnection.CreateModel();
            channel.ExchangeDeclare(exchange: _exchangeName, type: "direct");

            var routingKey = $"notifications_{notificationRequest.Priority}".ToLower();

            var eventName = @event.GetType().Name;
            var message = JsonConvert.SerializeObject(@event);
            var body = Encoding.UTF8.GetBytes(message);

            channel.BasicPublish(exchange: _exchangeName,
                                 routingKey: routingKey,
                                 basicProperties: null,
                                 body: body);
        }
    }
}
