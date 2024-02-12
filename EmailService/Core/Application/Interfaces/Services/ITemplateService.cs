namespace Application.Interfaces.Services
{
    using Models.Mailing;

    public interface ITemplateService
    {
        Task<string> GenerateEmailTemplate(string templateName, IEnumerable<TemplateData> placeholders);
        Task<string> GetLocalEmailTemplateAsync(string templateName);
    }
}