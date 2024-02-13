namespace Infrastructure.SMTP
{
    using Microsoft.Extensions.Options;

    using MimeKit;

    using MailKit.Security;
    using MailKit.Net.Smtp;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;
    using Application.Handlers.SMTP.Commands;

    public class SMTPService : ISMTPService
    {
        private readonly ITemplateService _templateService;
        private readonly IOptions<MailingSettings> _mailingSettings;

        public SMTPService(ITemplateService templateService, IOptions<MailingSettings> mailingSettings)
        {
            _templateService = templateService;
            _mailingSettings = mailingSettings;
        }

        public async Task<Result<string>> SendEmailWithLocalTemplate(SendTemplateEmailCommand model)
        {
            if (model.TemplateKey == null)
            {
                return Result<string>.Failure("Template Key is required");
            }

            model.Body = await _templateService.GenerateEmailTemplate(model.TemplateKey, model.TemplateData!);

            return await SendAsync(model);
        }

        public async Task<Result<string>> SendAsync(MailRequest request)
        {
            if (request.Body == null)
            {
                return Result<string>.Failure("Template Key is required");
            }

            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(_mailingSettings.Value.DisplayName, request.From ?? _mailingSettings.Value.From));

            foreach (string address in request.To)
            {
                email.To.Add(MailboxAddress.Parse(address));
            }

            if (!string.IsNullOrEmpty(request.ReplyTo))
            {
                email.ReplyTo.Add(new MailboxAddress(request.ReplyToName, request.ReplyTo));
            }

            if (request.Bcc != null)
            {
                foreach (string address in request.Bcc.Where(bccValue => !string.IsNullOrWhiteSpace(bccValue)))
                {
                    email.Bcc.Add(MailboxAddress.Parse(address.Trim()));
                }
            }

            if (request.Cc != null)
            {
                foreach (string? address in request.Cc.Where(ccValue => !string.IsNullOrWhiteSpace(ccValue)))
                {
                    email.Cc.Add(MailboxAddress.Parse(address.Trim()));
                }
            }

            if (request.Headers != null)
            {
                foreach (var header in request.Headers)
                {
                    email.Headers.Add(header.Key, header.Value);
                }
            }

            var builder = new BodyBuilder();
            email.Sender = new MailboxAddress(request.DisplayName ?? _mailingSettings.Value.DisplayName, request.From ?? _mailingSettings.Value.From);
            email.Subject = request.Subject;
            builder.HtmlBody = request.Body;

            if (request.AttachmentData != null)
            {
                foreach (var attachmentInfo in request.AttachmentData)
                {
                    builder.Attachments.Add(attachmentInfo.Key, attachmentInfo.Value);
                }
            }

            email.Body = builder.ToMessageBody();

            var response = string.Empty;

            var host = _mailingSettings.Value.Host;
            var port = _mailingSettings.Value.Port;

            using (var smtp = new SmtpClient())
            {
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_mailingSettings.Value.UserName, _mailingSettings.Value.Password);

                await smtp.SendAsync(email);

                await smtp.DisconnectAsync(true);
            }

            return Result<string>.SuccessResult("Email Sent.");
        }
    }
}
