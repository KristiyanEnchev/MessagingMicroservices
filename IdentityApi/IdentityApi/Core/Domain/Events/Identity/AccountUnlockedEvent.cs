namespace Domain.Events.Identity
{
    public class AccountUnlockedEvent : BaseEvent
    {
        public string UserId { get; }
        public string Email { get; }

        public AccountUnlockedEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }
}