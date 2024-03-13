namespace Application.Handlers.OneTimePin.Command
{
    using Application.Interfaces.OneTimePin;

    using MediatR;

    using Models.OneTimePin;

    using Shared;

    public class OneTimePinGenerateCommand : OneTimePinGenerateRequet, IRequest<Result<OneTimePinGenerateResponse>>
    {
        public class OneTimePinGenerateCommandHandler : IRequestHandler<OneTimePinGenerateCommand, Result<OneTimePinGenerateResponse>>
        {
            private readonly IOneTimePinService _oneTimePinService;

            public OneTimePinGenerateCommandHandler(IOneTimePinService oneTimePinService)
            {
                _oneTimePinService = oneTimePinService;
            }

            public async Task<Result<OneTimePinGenerateResponse>> Handle(OneTimePinGenerateCommand command, CancellationToken cancellationToken) 
            {
                var result = _oneTimePinService.GenerateOtp(command.Identifier!, command.ExpirationMinutes, null!);

                return result;
            }
        }
    }
}
