namespace Domain.Events.Identity.Roles
{
    public class RoleCreatedEvent : BaseEvent
    {
        public string RoleName { get; }
        public string CreatedBy { get; }

        public RoleCreatedEvent(string roleName, string createdBy)
        {
            RoleName = roleName;
            CreatedBy = createdBy;
        }
    }
}