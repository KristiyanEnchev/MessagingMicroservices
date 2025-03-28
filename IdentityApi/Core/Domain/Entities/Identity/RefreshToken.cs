namespace Domain.Entities.Identity
{
    using System;
    using System.ComponentModel.DataAnnotations.Schema;

    using Domain.Common;

    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; }
        public virtual User User { get; set; }
        public string UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? CreatedByIp { get; set; }
        public DateTime? RevokedDate { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReasonRevoked { get; set; }

        [NotMapped]
        public bool IsExpired => DateTime.UtcNow >= ExpiryDate;

        [NotMapped]
        public bool IsRevoked => RevokedDate != null;

        [NotMapped]
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}