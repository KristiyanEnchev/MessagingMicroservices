namespace Domain.Events.Identity
{
    public class UserRegisteredEvent : BaseEvent
    {
        public string UserId { get; }
        public string FirstName { get; }
        public string LastName { get; }

        public UserRegisteredEvent(string userId, string firstName, string lastName)
        {
            UserId = userId;
            FirstName = firstName;
            LastName = lastName;
        }
    }
}