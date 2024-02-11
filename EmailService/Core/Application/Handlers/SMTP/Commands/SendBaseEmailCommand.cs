namespace Application.Handlers.SMTP.Commands
{
    using Application.Interfaces.Services;
    using MediatR;

    using Models.Mailing;

    using Shared;
    using System.Collections.Generic;

    public class SendBaseEmailCommand : MailRequest, IRequest<Result<string>>
    {
        public SendBaseEmailCommand(
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

        public class SendBaseEmailCommandHandler : IRequestHandler<SendBaseEmailCommand, Result<string>> 
        {
            private readonly ISMTPService _smtpService;

            public SendBaseEmailCommandHandler(ISMTPService smtpService)
            {
                _smtpService = smtpService;
            }

            public async Task<Result<string>> Handle(SendBaseEmailCommand reques, CancellationToken cancellationToken) 
            {
                var result = await _smtpService.SendAsync(reques);

                return result;
            }
        }
    }
}
