namespace Application.Handlers.OneTimePin.Command
{
    using Application.Interfaces.OneTimePin;

    using MediatR;

    using Models.OneTimePin;

    using Shared;

    public class OneTimePinValidateCommand : OneTimePinValidateRequest, IRequest<Result<OneTimePinValidateResponse>>
    {
        public class OneTimePinValidateCommandHandler : IRequestHandler<OneTimePinValidateCommand, Result<OneTimePinValidateResponse>>
        {
            private readonly IOneTimePinService _oneTimePinService;

            public OneTimePinValidateCommandHandler(IOneTimePinService oneTimePinService)
            {
                _oneTimePinService = oneTimePinService;
            }

            public async Task<Result<OneTimePinValidateResponse>> Handle(OneTimePinValidateCommand command, CancellationToken cancellationToken) 
            {
                var result = _oneTimePinService.ValidateOtp(command.TransactionId!, command.Identifier!, command.Otp!);

                return result;
            }
        }
    }
}
