namespace Application.Handlers.OneTimePin.Command
{
    using System.Text.Json.Serialization;

    using Microsoft.AspNetCore.Identity;

    using MediatR;

    using Application.Interfaces.OneTimePin;

    using Models.OneTimePin;

    using Shared;

    public class OneTimePinGenerateCommand : OneTimePinGenerateRequet, IRequest<Result<OneTimePinGenerateResponse>>
    {
        [JsonIgnore]
        public bool Digits { get; set; } = true;
        [JsonIgnore]
        public int Size { get; set; } = 4;

        public class OneTimePinGenerateCommandHandler : IRequestHandler<OneTimePinGenerateCommand, Result<OneTimePinGenerateResponse>>
        {
            private readonly IOneTimePinService _oneTimePinService;

            public OneTimePinGenerateCommandHandler(IOneTimePinService oneTimePinService)
            {
                _oneTimePinService = oneTimePinService;
            }

            public async Task<Result<OneTimePinGenerateResponse>> Handle(OneTimePinGenerateCommand command, CancellationToken cancellationToken) 
            {
                var result = _oneTimePinService.GenerateOtp(command.Identifier!, command.ExpirationMinutes, Getoptions(command.Digits, command.Size)!);

                return result;
            }

            private PasswordOptions Getoptions(bool digits, int size) 
            {
                var option = new PasswordOptions();

                if (digits)
                {
                    option.RequiredLength = 20;
                    option.RequiredUniqueChars = size;
                    option.RequireDigit = true;
                    option.RequireLowercase = false;
                    option.RequireNonAlphanumeric = false;
                    option.RequireUppercase = false;
                }
                else 
                {
                    option.RequiredLength = 20;
                    option.RequiredUniqueChars = size;
                    option.RequireDigit = true;
                    option.RequireLowercase = true;
                    option.RequireNonAlphanumeric = true;
                    option.RequireUppercase = true;
                }

                return option;
            }
        }
    }
}
