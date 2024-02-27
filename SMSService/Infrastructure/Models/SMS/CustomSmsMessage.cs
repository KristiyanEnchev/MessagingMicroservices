namespace Models.SMS
{
    public class CustomSmsMessage : BaseSmsMessage
    {
        public string? SmsProvider { get; set; }
        public string? Message { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}