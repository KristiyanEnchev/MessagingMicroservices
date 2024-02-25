namespace Models.SMS
{
    public class CustomSmsMessage : BaseSmsMessage
    {
        public string? Message { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}