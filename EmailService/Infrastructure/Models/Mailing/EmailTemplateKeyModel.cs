namespace Models.Mailing
{
    using System.Text.Json.Serialization;

    public class EmailTemplateKeyModel : MailRequest
    {
        public EmailTemplateKeyModel(
            List<string> to,
            string subject,
            string? body = null,
            string? from = null,
            string? displayName = null,
            string? replyTo = null,
            string? replyToName = null,
            List<string>? bcc = null,
            List<string>? cc = null,
            IDictionary<string, byte[]>? attachmentData = null,
            IDictionary<string, string>? headers = null) 
            : base(to, subject, body, from, displayName, replyTo, replyToName, bcc, cc, attachmentData, headers)
        {
        }

        public string? TemplateKey { get; set; }
        public IEnumerable<TemplateData>? TempateData { get; set; }

        [JsonIgnore]
        public override string? Body { get; set; }
    }
}