namespace Application.Handlers.SMTP.Commands
{
    using System.Collections.Generic;

    using MediatR;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;

    public class SendTemplateEmailCommand : EmailTemplateKeyModel, IRequest<Result<string>>
    {
        public SendTemplateEmailCommand(
            List<string> to,
            string subject,
            string? body = null,
            string? from = null,
            string? displayName = null,
            string? replyTo = null,
            string? replyToName = null,
            List<string>? bcc = null,
            List<string>? cc = null,
            IDictionary<string, byte[]>? attachmentData = null,
            IDictionary<string, string>? headers = null) 
            : base(to, subject, body, from, displayName, replyTo, replyToName, bcc, cc, attachmentData, headers)
        {
        }

        public class SendTemplateEmailCommandHandler : IRequestHandler<SendTemplateEmailCommand, Result<string>> 
        {
            private readonly ISMTPService _smtpService;

            public SendTemplateEmailCommandHandler(ISMTPService smtpService)
            {
                _smtpService = smtpService;
            }

            public async Task<Result<string>> Handle(SendTemplateEmailCommand request, CancellationToken cancellation) 
            {
                var response = await _smtpService.SendEmailWithLocalTemplate(request);

                return response;
            }
        }
    }
}