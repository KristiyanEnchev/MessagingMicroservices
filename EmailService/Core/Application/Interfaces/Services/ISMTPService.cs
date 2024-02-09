namespace Application.Interfaces.Services
{
    using Models.Mailing;

    using Shared;

    public interface ISMTPService
    {
        Task<Result<string>> SendAsync(MailRequest request);
        Task<Result<string>> SendEmailWithLocalTemplate(EmailTemplateKeyModel model);
    }
}