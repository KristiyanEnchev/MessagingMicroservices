namespace Application.Handlers.Identity.Commands.TwoFactor
{
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Shared;

    using Application.Interfaces.Identity;

    using Models.Identity;

    public class Generate2FACodeCommand : IRequest<Result<TwoFactorCodeResult>>
    {
        public string UserId { get; }

        public Generate2FACodeCommand(string userId)
        {
            UserId = userId;
        }

        public class Generate2FACodeCommandHandler : IRequestHandler<Generate2FACodeCommand, Result<TwoFactorCodeResult>>
        {
            private readonly IIdentity _identityService;

            public Generate2FACodeCommandHandler(IIdentity identityService)
            {
                _identityService = identityService;
            }

            public async Task<Result<TwoFactorCodeResult>> Handle(Generate2FACodeCommand request, CancellationToken cancellationToken)
            {
                return await _identityService.Generate2FACodeAsync(request.UserId);
            }
        }
    }
}