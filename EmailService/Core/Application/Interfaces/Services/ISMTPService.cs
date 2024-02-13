namespace Application.Interfaces.Services
{
    using Application.Handlers.SMTP.Commands;

    using Models.Mailing;

    using Shared;

    public interface ISMTPService
    {
        Task<Result<string>> SendAsync(MailRequest request);
        Task<Result<string>> SendEmailWithLocalTemplate(SendTemplateEmailCommand model);
    }
}