namespace Application.Handlers.SMTP.Commands
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using AutoMapper;

    using Hangfire;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;

    public class SendTemplateEmailCommand : EmailTemplateKeyModel, IRequest<Result<string>>
    {
        public virtual void Mapping(Profile mapper)
        {
            mapper.CreateMap<SendTemplateEmailCommand, EmailTemplateKeyModel>().ReverseMap();
            mapper.CreateMap<SendTemplateEmailCommand, MailRequest>().ReverseMap();
        }

        public class SendTemplateEmailCommandHandler : IRequestHandler<SendTemplateEmailCommand, Result<string>>
        {
            private readonly IServiceProvider _serviceProvider;

            public SendTemplateEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendTemplateEmailCommand request, CancellationToken cancellation)
            {
                var emailService = request.EmailProvider!.ToLower() switch
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