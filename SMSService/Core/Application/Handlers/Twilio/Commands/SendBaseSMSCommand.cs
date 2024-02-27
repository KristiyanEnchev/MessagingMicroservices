namespace Application.Handlers.SMTP.Commands
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using AutoMapper;

    using Shared;

    using Models.SMS;

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
                var emailService = request.SmsProvider!.ToLower() switch
                {
                    "twilio" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    _ => throw new ArgumentException("Invalid email provider specified."),
                };

                var result = await emailService.SendCustomEmail(request);

                return result;
            }
        }
    }
}
