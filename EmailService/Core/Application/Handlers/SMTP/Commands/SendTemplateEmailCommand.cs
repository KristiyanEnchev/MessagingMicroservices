namespace Application.Handlers.SMTP.Commands
{
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.DependencyInjection;

    using Newtonsoft.Json;

    using MediatR;

    using Hangfire;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;

    public class SendTemplateEmailCommand : MailRequest, IRequest<Result<string>>
    {
        public SendTemplateEmailCommand() : base(new List<string>(), string.Empty)
        {
        }

        public string EmailProvider { get; set; } = "";
        public string TemplateKey { get; set; } = "";
        public List<TemplateData> TemplateData { get; set; } = new List<TemplateData>();
        public List<IFormFile> Attachments { get; set; } = new List<IFormFile>();

        [JsonIgnore]
        public override string? Body { get; set; }
        [JsonIgnore]
        public override IDictionary<string, byte[]> AttachmentData { get; set; }

        public class SendTemplateEmailCommandHandler : IRequestHandler<SendTemplateEmailCommand, Result<string>>
        {
            private readonly IServiceProvider _serviceProvider;

            public SendTemplateEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendTemplateEmailCommand request, CancellationToken cancellation)
            {
                if (request == null || request.To == null || request.Subject == null)
                {
                    return Result<string>.Failure("Invalid email request.");
                }

                var attachmentData = new Dictionary<string, byte[]>();
                foreach (var file in request.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            await file.CopyToAsync(ms);
                            var fileBytes = ms.ToArray();
                            attachmentData.Add(file.FileName, fileBytes);
                        }
                    }
                }

                request.AttachmentData = attachmentData;

                var emailService = request.EmailProvider.ToLower() switch
                {
                    "smtp" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    "sendgrid" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    _ => throw new ArgumentException("Invalid email provider specified."),
                };

                BackgroundJob.Enqueue(() => emailService.SendEmailWithLocalTemplate(request));

                return Result<string>.SuccessResult("Template email send to request queued.");
            }
        }
    }
}