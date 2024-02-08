namespace Infrastructure.SMTP
{
    using System.Net.Mail;

    using Models;
    using Models.Attachments;

    using Application.Interfaces.Services;

    public class SMTPService
    {
        private readonly ITemplateService _templateService;
        private readonly IUtilityService _utilityService;

        public SMTPService(ITemplateService templateService, IUtilityService utilityService)
        {
            _templateService = templateService;
            _utilityService = utilityService;
        }

        private async Task SendEmail(
            string from,
            string fromDisplayName,
            IEnumerable<string> to,
            IEnumerable<string> cc,
            IEnumerable<string> bcc,
            string subject,
            IEnumerable<AttachmentBaseModel> attachments,
            string html,
            IEnumerable<TemplateData> templateData)
        {
            try
            {
                if (string.IsNullOrEmpty(from))
                    from = emailSettings.Value.From!;

                if (string.IsNullOrEmpty(fromDisplayName))
                    fromDisplayName = emailSettings.Value.DisplayName!;

                using (var email = new MailMessage())
                {
                    var workingDir = CreateWorkingDir(emailSettings.Value.LocalDirectory);

                    var files = GetAttachmentsAsync(workingDir, attachments);

                    email.From = new MailAddress(from, fromDisplayName);

                    AddRecipients(to, email.To);
                    AddRecipients(cc, email.CC);
                    AddRecipients(bcc, email.Bcc);

                    email.IsBodyHtml = true;
                    email.Subject = await templateService.ReplaceDataOnTemplate(subject, templateData);
                    email.Body = await templateService.ReplaceDataOnTemplate(html, templateData);

                    await files;
                    foreach (var key in files.Result.Keys)
                        email.Attachments.Add(new Attachment(files.Result[key]));

                    using (var smtp = new SmtpClient(host: emailSettings.Value.Host, port: emailSettings.Value.Port))
                    {
                        await smtp.SendMailAsync(email).ConfigureAwait(false);

                        smtp.Dispose();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new CustomExeption($"Somthing went wrong: {string.Join(Environment.NewLine, ex.Message)}");
            }
        }
    }
}
