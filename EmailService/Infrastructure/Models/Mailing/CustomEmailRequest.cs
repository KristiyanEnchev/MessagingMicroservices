namespace Models.Mailing
{
    using System.ComponentModel.DataAnnotations;

    using Shared.Mappings;

    public class CustomEmailRequest : BaseEmailRequest, IMapFrom<MailRequest>
    {
        [Required]
        public string? EmailProvider { get; set; }
        [Required]
        public string Body { get; set; }
    }
}
