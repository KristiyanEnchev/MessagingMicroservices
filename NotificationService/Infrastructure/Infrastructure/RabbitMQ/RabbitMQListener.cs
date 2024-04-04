namespace Infrastructure.RabbitMQ
{
    using System.Text;

    using Newtonsoft.Json;

    using Microsoft.Extensions.Hosting;

    using MediatR;

    using global::RabbitMQ.Client;
    using global::RabbitMQ.Client.Events;

    using Application.Handlers.Notification.Commands;

    using Models.Notification;

    public class RabbitMQListener : BackgroundService
    {
        private const string ExchangeName = "notification_event_bus";

        private readonly RabbitMQPersistentConnection _persistentConnection;
        private IModel _consumerChannel;
        private readonly IMediator _mediator;

        public RabbitMQListener(RabbitMQPersistentConnection persistentConnection, IMediator mediator)
        {
            _persistentConnection = persistentConnection ?? throw new ArgumentNullException(nameof(persistentConnection));
            _consumerChannel = CreateConsumerChannel();
            _mediator = mediator;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var priorities = new[] { "high", "medium", "low" };

            foreach (var priority in priorities)
            {
                var queueName = $"notifications_{priority}";
                SubscribeToQueue(queueName);
            }

            await Task.CompletedTask;
        }

        private void SubscribeToQueue(string queueName)
        {
            var consumer = new AsyncEventingBasicConsumer(_consumerChannel);

            consumer.Received += async (model, ea) =>
            {
                var eventName = ea.RoutingKey;
                var message = Encoding.UTF8.GetString(ea.Body.Span);

                await HandleEvent(eventName, message);

                _consumerChannel.BasicAck(ea.DeliveryTag, multiple: false);
            };

            _consumerChannel.BasicConsume(
                queue: queueName,
                autoAck: false,
                consumer: consumer);
        }

        private IModel CreateConsumerChannel()
        {
            if (!_persistentConnection.IsConnected)
            {
                _persistentConnection.TryConnect();
            }

            var channel = _persistentConnection.CreateModel();

            channel.ExchangeDeclare(exchange: ExchangeName, type: "direct");

            var priorities = new[] { "high", "medium", "low" };
            foreach (var priority in priorities)
            {
                var queueName = $"notifications_{priority}";
                channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
                channel.QueueBind(queue: queueName, exchange: ExchangeName, routingKey: $"{priority}.*");
            }

            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

            return channel;
        }

        private async Task HandleEvent(string eventName, string message)
        {
            var notificationRequest = JsonConvert.DeserializeObject<NotificationRequest>(message);
            if (notificationRequest == null) return;

            var sendNotificationCommand = new SendNotificationCommand
            {
                ClientId = notificationRequest.ClientId,                          // application name
                Type = notificationRequest.Type,                                  // Push ot Scheduled 
                Message = notificationRequest.Message,                            // message in the notification
                Priority = notificationRequest.Priority,                          // priority
                TargetAudiences = notificationRequest.TargetAudiences,            // user or group of users
            };

            await _mediator.Send(sendNotificationCommand);
            Console.WriteLine($"Event Received: {eventName}");
        }

        public override void Dispose()
        {
            _consumerChannel?.Dispose();
            base.Dispose();
        }
    }
}
