namespace Models.SMS
{
    using Shared.Mappings;

    public class CustomSmsMessage : BaseSmsMessage, IMapFrom<SmsMessage>
    {
        public string? SmsProvider { get; set; }
        public string? Message { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}