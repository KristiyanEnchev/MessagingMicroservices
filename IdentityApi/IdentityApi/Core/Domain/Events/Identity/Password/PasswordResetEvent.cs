namespace Domain.Events.Identity.Password
{
    public class PasswordResetEvent : BaseEvent
    {
        public string UserId { get; }

        public PasswordResetEvent(string userId)
        {
            UserId = userId;
        }
    }
}