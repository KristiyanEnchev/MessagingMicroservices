namespace Domain.Events.Identity.Roles
{
    public class RoleDeletedEvent : BaseEvent
    {
        public string RoleName { get; }
        public string DeletedBy { get; }

        public RoleDeletedEvent(string roleName, string deletedBy)
        {
            RoleName = roleName;
            DeletedBy = deletedBy;
        }
    }
}
