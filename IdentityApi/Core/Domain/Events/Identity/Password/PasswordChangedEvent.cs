namespace Domain.Events.Identity.Password
{
    public class PasswordChangedEvent : BaseEvent
    {
        public string UserId { get; }

        public PasswordChangedEvent(string userId)
        {
            UserId = userId;
        }
    }
}