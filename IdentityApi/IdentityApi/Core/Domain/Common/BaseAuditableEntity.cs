namespace Domain.Common
{
    using Domain.Interfaces;

    public abstract class BaseAuditableEntity : BaseEntity, IAuditableEntity
    {
        public string? CreatedBy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
    }
}