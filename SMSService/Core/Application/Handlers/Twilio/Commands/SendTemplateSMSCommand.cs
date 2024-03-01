namespace Application.Handlers.Twilio.Commands
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using AutoMapper;

    using Hangfire;

    using Shared;

    using Models.SMS;

    using Application.Interfaces.SMS;

    public class SendTemplateSMSCommand : TemplateSmsMessage, IRequest<Result<string>>
    {
        public virtual void Mapping(Profile mapper)
        {
            mapper.CreateMap<SendTemplateSMSCommand, TemplateSmsMessage>().ReverseMap();
            mapper.CreateMap<SendTemplateSMSCommand, SmsMessage>().ReverseMap();
        }

        public class SendTemplateEmailCommandHandler : IRequestHandler<SendTemplateSMSCommand, Result<string>>
        {
            private readonly IServiceProvider _serviceProvider;

            public SendTemplateEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendTemplateSMSCommand request, CancellationToken cancellation)
            {
                var smsService = request.SmsProvider!.ToLower() switch
                {
                    "twilio" => _serviceProvider.GetRequiredService<ITwilioSMSService>(),
                    _ => throw new ArgumentException("Invalid sms provider specified."),
                };

                BackgroundJob.Enqueue(() => smsService.SendSMSWithLocalTemplate(request));

                return Result<string>.SuccessResult("Template sms send to request queued.");
            }
        }
    }
}