namespace Application.Handlers.Account.Comands
{
    using MediatR;

    using Models.Enums;

    using Shared;

    using Application.Interfaces.Identity;

    public class ToggleStatusCommand : IRequest<Result<string>>
    {
        public string Identifier { get; set; }
        public ToggleUserValue ToggleValue { get; set; }

        public ToggleStatusCommand(string value, ToggleUserValue toggleUserValue)
        {
            this.Identifier = value;
            this.ToggleValue = toggleUserValue;
        }

        public class ToggleStatusCommandHandler : IRequestHandler<ToggleStatusCommand, Result<string>>
        {
            private readonly IUserService userService;

            public ToggleStatusCommandHandler(IUserService userService)
            {
                this.userService = userService;
            }

            public async Task<Result<string>> Handle(ToggleStatusCommand request, CancellationToken cancellationToken)
            {
                var result = await userService.ToggleStatusAsync(request.Identifier, request.ToggleValue);

                return result;
            }
        }
    }
}