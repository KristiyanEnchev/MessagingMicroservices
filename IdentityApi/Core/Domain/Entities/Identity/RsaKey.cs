namespace Domain.Entities.Identity
{
    using System;

    using Domain.Common;

    public class RsaKey : BaseEntity
    {
        public string PublicKey { get; set; }
        public string PrivateKey { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ExpiresOn { get; set; }
        public bool IsActive { get; set; }
    }
}