namespace Domain.Events.Identity
{
    using Domain.Events;

    public class UserToggleEvent : BaseEvent
    {
        public UserToggleEvent(bool isActive, bool isEmailConfirmed, bool isLockedOut, IEnumerable<string> changedProperties)
        {
            IsActive = isActive;
            IsEmailConfirmed = isEmailConfirmed;
            IsLockedOut = isLockedOut;
            ChangedProperties = changedProperties ?? new List<string>();
        }

        public bool IsActive { get; }
        public bool IsEmailConfirmed { get; }
        public bool IsLockedOut { get; }
        public IEnumerable<string> ChangedProperties { get; }
    }
}