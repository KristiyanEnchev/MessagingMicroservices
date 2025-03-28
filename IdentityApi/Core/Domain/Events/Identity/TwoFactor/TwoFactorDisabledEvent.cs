namespace Domain.Events.Identity.TwoFactor
{
    public class TwoFactorDisabledEvent : BaseEvent
    {
        public string UserId { get; }
        public string Email { get; }

        public TwoFactorDisabledEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }
}