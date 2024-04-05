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

        public RabbitMQPersistentConnection(IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
            if (!IsConnected)
            {
                TryConnect();
            }
        }

        public bool IsConnected => _connection != null && _connection.IsOpen && !_disposed;

        public bool TryConnect()
        {
            try
            {
                _connection = _connectionFactory.CreateConnection();
                if (IsConnected)
                {
                    return true;
                }

                return false;
            }
            catch (SocketException ex)
            {
                throw new CustomException("Could not create connection to RabbitMQ", new List<string> { ex.Message, ex.InnerException!.ToString() ?? ""});
            }
            catch (BrokerUnreachableException ex)
            {
                throw new CustomException("Could not reach RabbitMQ broker", new List<string> { ex.Message, ex.InnerException!.ToString() ?? "" });
            }
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
                throw new CustomException("Could not dispose the RabbitMQ connection", new List<string> { ex.Message, ex.InnerException!.ToString() ?? "" });
            }
        }
    }
}
