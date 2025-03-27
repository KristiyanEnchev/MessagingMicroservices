namespace Domain.Entities.Identity
{
    using Domain.Common;

    public class UserActivity : BaseEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string ActivityType { get; set; } // Login, Logout, PasswordChange, etc.
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsSuccessful { get; set; }
        public string AdditionalInfo { get; set; }
    }
}