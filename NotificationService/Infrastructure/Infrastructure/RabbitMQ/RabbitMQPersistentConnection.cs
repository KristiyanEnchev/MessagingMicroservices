namespace Infrastructure.RabbitMQ
{
    using System.Net.Sockets;

    using global::RabbitMQ.Client;
    using global::RabbitMQ.Client.Exceptions;

    using Shared.Exceptions;

    public class RabbitMQPersistentConnection : IDisposable
    {
        private readonly IConnectionFactory _connectionFactory;
        private IConnection _connection;
        private bool _disposed;
        private readonly int _retryCount;

        public RabbitMQPersistentConnection(IConnectionFactory connectionFactory, int retryCount = 7)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
            _retryCount = retryCount;
            if (!IsConnected)
            {
                TryConnect();
            }
        }

        public bool IsConnected => _connection != null && _connection.IsOpen && !_disposed;

        public bool TryConnect()
        {
            for (int i = 0; i <= _retryCount; i++)
            {
                try
                {
                    _connection = _connectionFactory.CreateConnection();
                    if (IsConnected)
                    {
                        return true;
                    }
                }
                catch (SocketException ex)
                {
                    Console.WriteLine($"Retry {i} failed: {ex.Message}");
                }
                catch (BrokerUnreachableException ex)
                {
                    Console.WriteLine($"Retry {i} failed: {ex.Message}");
                }

                Thread.Sleep((int)Math.Pow(2, i) * 1000);
            }

            throw new CustomException("Failed to connect to RabbitMQ after several attempts.");
        }

        public IModel CreateModel()
        {
            if (!IsConnected)
            {
                throw new InvalidOperationException("No RabbitMQ connections are available to perform this action");
            }

            return _connection.CreateModel();
        }

        public void Dispose()
        {
            if (_disposed) return;

            _disposed = true;
            try
            {
                _connection?.Dispose();
            }
            catch (IOException ex)
            {
                throw new CustomException("Could not dispose the RabbitMQ connection", new List<string> { ex.Message, ex.InnerException?.ToString() ?? "" });
            }
        }
    }
}