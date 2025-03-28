namespace Application.Handlers.Identity.Commands.User
{
    using MediatR;

    using Shared;
    using Application.Interfaces.Identity;

    public class DisableTwoFactorAuthenticationCommand : IRequest<Result<string>>
    {
        public string? Email { get; set; }

        public DisableTwoFactorAuthenticationCommand(string email)
        {
            this.Email = email;
        }

        public class DisableTwoFactorAuthenticationCommandHandler : IRequestHandler<DisableTwoFactorAuthenticationCommand, Result<string>>
        {
            private readonly IIdentity _identity;

            public DisableTwoFactorAuthenticationCommandHandler(IIdentity identity)
            {
                _identity = identity;
            }

            public async Task<Result<string>> Handle(DisableTwoFactorAuthenticationCommand request, CancellationToken cancellationToken) 
            {
                var result = await _identity.DisableTwoFactorAuthentication(request.Email!);

                return result;
            }
        }
    }
}