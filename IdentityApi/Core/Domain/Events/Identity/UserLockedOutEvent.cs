namespace Domain.Events.Identity
{
    public class UserLockedOutEvent : BaseEvent
    {
        public string UserId { get; }
        public string Email { get; }
        public DateTimeOffset? LockoutEnd { get; }

        public UserLockedOutEvent(string userId, string email, DateTimeOffset? lockoutEnd)
        {
            UserId = userId;
            Email = email;
            LockoutEnd = lockoutEnd;
        }
    }
}