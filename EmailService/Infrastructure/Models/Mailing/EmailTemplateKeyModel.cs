﻿namespace Models.Mailing
{
    using System.ComponentModel.DataAnnotations;

    using Shared.Mappings;

    public class EmailTemplateKeyModel : BaseEmailRequest, IMapFrom<MailRequest>
    {
        [Required]
        public string? EmailProvider { get; set; }
        [Required]
        public string? TemplateKey { get; set; }
    }
}