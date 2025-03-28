namespace Domain.Events.Identity
{
    using Domain.Events;

    public class ApplicationUserUpdatedEvent : BaseEvent
    {
        public ApplicationUserUpdatedEvent(string userId, List<string> changedProperties)
        {
            UserId = userId;
            ChangedProperties = changedProperties;
        }

        public string UserId { get; }
        public List<string> ChangedProperties { get; }
    }
}
