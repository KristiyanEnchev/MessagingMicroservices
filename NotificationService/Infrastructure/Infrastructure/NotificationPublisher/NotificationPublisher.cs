namespace Infrastructure.NotificationPublisher
{
    public class NotificationPublisher
    {
        private readonly Dictionary<string, List<Action<NotificationMessage>>> _subscribers = new();

        public void Subscribe(string area, Action<NotificationMessage> callback)
        {
            if (!_subscribers.ContainsKey(area))
            {
                _subscribers[area] = new List<Action<NotificationMessage>>();
            }

            _subscribers[area].Add(callback);
        }

        public void Publish(NotificationMessage message)
        {
            if (message.TargetAreas == null) return;

            foreach (var area in message.TargetAreas)
            {
                if (_subscribers.ContainsKey(area))
                {
                    _subscribers[area].ForEach(subscriber => subscriber(message));
                }
            }
        }
    }
}
