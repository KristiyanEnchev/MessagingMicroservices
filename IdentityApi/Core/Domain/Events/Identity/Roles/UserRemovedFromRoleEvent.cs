namespace Domain.Events.Identity.Roles
{
    public class UserRemovedFromRoleEvent : BaseEvent
    {
        public string UserId { get; }
        public string RoleName { get; }

        public UserRemovedFromRoleEvent(string userId, string roleName)
        {
            UserId = userId;
            RoleName = roleName;
        }
    }
}
