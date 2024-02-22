namespace Models.SMS
{
    public class TemplateSmsMessage : BaseSmsMessage
    {
        public string? TemplateName { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}