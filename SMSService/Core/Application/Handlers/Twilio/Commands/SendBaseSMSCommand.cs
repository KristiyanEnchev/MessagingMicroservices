namespace Application.Handlers.Twilio.Commands
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using AutoMapper;

    using Hangfire;

    using Shared;

    using Models.SMS;

    using Application.Interfaces.SMS;

    public class SendBaseSMSCommand : CustomSmsMessage, IRequest<Result<string>>
    {
        public virtual void Mapping(Profile mapper)
        {
            mapper.CreateMap<SendBaseSMSCommand, CustomSmsMessage>().ReverseMap();
            mapper.CreateMap<SendBaseSMSCommand, SmsMessage>().ReverseMap();
        }

        public class SendBaseEmailCommandHandler : IRequestHandler<SendBaseSMSCommand, Result<string>>
        {
            private readonly IServiceProvider _serviceProvider;

            public SendBaseEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendBaseSMSCommand request, CancellationToken cancellationToken)
            {
                var smsService = request.SmsProvider!.ToLower() switch
                {
                    "twilio" => _serviceProvider.GetRequiredService<ITwilioSMSService>(),
                    _ => throw new ArgumentException("Invalid sms provider specified."),
                };

                BackgroundJob.Enqueue(() => smsService.SendCustomSMS(request));

                return Result<string>.SuccessResult("Sms send request queued.");
            }
        }
    }
}