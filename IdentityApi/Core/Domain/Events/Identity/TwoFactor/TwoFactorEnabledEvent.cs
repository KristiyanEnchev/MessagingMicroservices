namespace Domain.Events.Identity.TwoFactor
{
    public class TwoFactorEnabledEvent : BaseEvent
    {
        public string UserId { get; }
        public string Email { get; }

        public TwoFactorEnabledEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }
}