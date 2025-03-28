namespace Domain.Events.Identity.Roles
{
    public class UserAddedToRoleEvent : BaseEvent
    {
        public string UserId { get; }
        public string RoleName { get; }

        public UserAddedToRoleEvent(string userId, string roleName)
        {
            UserId = userId;
            RoleName = roleName;
        }
    }
}