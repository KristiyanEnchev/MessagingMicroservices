namespace Application.Interfaces.Services
{
    using System.Net.Mail;

    using Models;
    using Models.Attachments;

    public interface IUtilityService
    {
        string CreateWorkingDir(string rootDir);
        Task<IDictionary<string, string>> GetAttachmentsAsync(string workingDir, IEnumerable<AttachmentBaseModel> attachments);
        void AddRecipients(IEnumerable<string> addresses, MailAddressCollection collection);
        Task<EmailTemplateModel> ParseEmailDefinition(HttpResponseMessage message);
    }
}