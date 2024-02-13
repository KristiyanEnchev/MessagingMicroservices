namespace Models.Mailing
{
    using Microsoft.AspNetCore.Http;

    public class EmailRequestDto
    {
        public List<string> To { get; set; }
        public string Subject { get; set; }
        public string TemplateKey { get; set; }
        public string? Body { get; set; }
        public string? From { get; set; }
        public string? DisplayName { get; set; }
        public string? ReplyTo { get; set; }
        public string? ReplyToName { get; set; }
        public List<string>? Bcc { get; set; }
        public List<string>? Cc { get; set; }
        public List<TemplateData>? TemplateData { get; set; }
        public List<IFormFile>? Attachments { get; set; }
        public IDictionary<string, string>? Headers { get; set; }
    }
}
