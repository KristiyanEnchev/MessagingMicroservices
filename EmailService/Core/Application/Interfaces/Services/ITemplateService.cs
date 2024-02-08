namespace Application.Interfaces.Services
{
    using Models;

    public interface ITemplateService
    {
        Task<string> GetLocalEmailTemplate(string templateName);
        EmailTemplateModel LoadTemplateFromFile(string templateName);
        Task<string> ApplyPartialTemplate(string templateName);
        Task<string> ReplaceDataOnTemplate(string templateContent, IEnumerable<TemplateData> placeholders);
    }
}