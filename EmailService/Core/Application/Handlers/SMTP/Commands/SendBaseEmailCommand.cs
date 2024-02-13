namespace Application.Handlers.SMTP.Commands
{
    using System.Collections.Generic;

    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;

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

        public string EmailProvider { get; set; }

        public class SendBaseEmailCommandHandler : IRequestHandler<SendBaseEmailCommand, Result<string>> 
        {
            private readonly IServiceProvider _serviceProvider;

            public SendBaseEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendBaseEmailCommand request, CancellationToken cancellationToken) 
            {
                var emailService = request.EmailProvider.ToLower() switch
                {
                    "smtp" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    "sendgrid" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    _ => throw new ArgumentException("Invalid email provider specified."),
                };

                var result = await emailService.SendAsync(request);

                return result;
            }
        }
    }
}
