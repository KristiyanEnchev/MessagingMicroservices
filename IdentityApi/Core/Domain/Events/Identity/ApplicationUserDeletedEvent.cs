namespace Domain.Events.Identity
{
    using Domain.Events;

    public class ApplicationUserDeletedEvent : BaseEvent
    {
        public ApplicationUserDeletedEvent(string userId)
        {
            UserId = userId;
        }

        public string UserId { get; }
    }
}
