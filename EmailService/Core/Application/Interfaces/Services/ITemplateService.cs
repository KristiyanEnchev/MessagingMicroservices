namespace Application.Interfaces.Services
{
    using Models.Mailing;

    public interface ITemplateService
    {
        Task<string> ProcessEmailTemplate(string template, IEnumerable<TemplateData> placeholders);
        Task<string> GenerateEmailTemplate(string templateName, IEnumerable<TemplateData> placeholders);
        Task<string> GetLocalEmailTemplateAsync(string templateName);
    }
}