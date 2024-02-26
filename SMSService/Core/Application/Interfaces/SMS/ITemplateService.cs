namespace Application.Interfaces.SMS
{
    using Models.SMS;

    public interface ITemplateService
    {
        Task<string> ProcessSMSTemplate(string template, IEnumerable<TemplateData> placeholders);
        Task<string> GenerateSMSTemplate(string templateName, IEnumerable<TemplateData> placeholders);
        Task<string> GetLocalSMSTemplateAsync(string templateName);
    }
}