namespace Models.Mailing
{
    using System.ComponentModel.DataAnnotations;

    public class BaseEmailRequest
    {
        public string? From { get; set; }
        [Required]
        public List<string> To { get; set; }
        public List<string>? Cc { get; set; }
        public List<string>? Bcc { get; set; }
        public string Subject { get; set; }

        public string? DisplayName { get; set; }
        public string? ReplyTo { get; set; }
        public string? ReplyToName { get; set; }

        public IList<TemplateData>? TemplateData { get; set; }
        public IEnumerable<FileAttachmentModel>? AttachmentFiles { get; set; }
        public IDictionary<string, string>? Headers { get; set; }
    }
}