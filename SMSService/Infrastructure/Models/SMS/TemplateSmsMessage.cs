namespace Models.SMS
{
    using Shared.Mappings;

    public class TemplateSmsMessage : BaseSmsMessage, IMapFrom<SmsMessage>
    {
        public string? SmsProvider { get; set; }
        public string? TemplateName { get; set; }
        public IList<TemplateData>? TemplateData { get; set; }
    }
}