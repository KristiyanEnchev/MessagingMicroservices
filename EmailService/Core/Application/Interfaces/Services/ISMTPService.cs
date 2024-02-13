namespace Application.Interfaces.Services
{
    using Models.Mailing;

    using Shared;

    public interface ISMTPService
    {
        Task<Result<string>> SendCustomEmail(CustomEmailRequest model);
        Task<Result<string>> SendEmailWithLocalTemplate(EmailTemplateKeyModel model);
    }
}