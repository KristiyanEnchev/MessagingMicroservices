namespace Domain.Events.Identity
{
    public class EmailConfirmedEvent : BaseEvent
    {
        public string UserId { get; }
        public string Email { get; }

        public EmailConfirmedEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }
}