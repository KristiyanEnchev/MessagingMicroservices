namespace Application.Interfaces.Services
{
    using Models.Mailing;

    public interface ITemplateService
    {
        Task<string> GenerateEmailTemplateAsync(string templateName, IEnumerable<TemplateData> mailTemplateModel);
        Task<string> GetLocalEmailTemplateAsync(string templateName);
    }
}