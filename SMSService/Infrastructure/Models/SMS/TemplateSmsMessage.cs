namespace Models.SMS
{
    public class TemplateSmsMessage : BaseSmsMessage
    {
        public string? SmsProvider { get; set; }
        public string? TemplateName { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}