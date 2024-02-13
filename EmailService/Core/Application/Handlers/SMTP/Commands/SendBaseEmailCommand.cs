namespace Application.Handlers.SMTP.Commands
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    using AutoMapper;

    using Application.Interfaces.Services;

    using Models.Mailing;

    using Shared;

    public class SendBaseEmailCommand : CustomEmailRequest, IRequest<Result<string>>
    {
        public virtual void Mapping(Profile mapper)
        {
            mapper.CreateMap<SendBaseEmailCommand, CustomEmailRequest>().ReverseMap();
            mapper.CreateMap<SendBaseEmailCommand, MailRequest>().ReverseMap();
        }

        public class SendBaseEmailCommandHandler : IRequestHandler<SendBaseEmailCommand, Result<string>> 
        {
            private readonly IServiceProvider _serviceProvider;

            public SendBaseEmailCommandHandler(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider;
            }

            public async Task<Result<string>> Handle(SendBaseEmailCommand request, CancellationToken cancellationToken) 
            {
                var emailService = request.EmailProvider!.ToLower() switch
                {
                    "smtp" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    "sendgrid" => _serviceProvider.GetRequiredService<ISMTPService>(),
                    _ => throw new ArgumentException("Invalid email provider specified."),
                };

                var result = await emailService.SendCustomEmail(request);

                return result;
            }
        }
    }
}
