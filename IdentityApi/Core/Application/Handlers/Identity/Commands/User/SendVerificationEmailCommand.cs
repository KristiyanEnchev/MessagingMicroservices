namespace Application.Handlers.Identity.Commands.User
{
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Shared;
    using Application.Interfaces.Identity;

    public class SendVerificationEmailCommand : IRequest<Result<string>>
    {
        public string Email { get; }
        public string Origin { get; }

        public SendVerificationEmailCommand(string email, string origin)
        {
            Email = email;
            Origin = origin;
        }

        public class SendVerificationEmailCommandHandler : IRequestHandler<SendVerificationEmailCommand, Result<string>>
        {
            private readonly IIdentity _identityService;

            public SendVerificationEmailCommandHandler(IIdentity identityService)
            {
                _identityService = identityService;
            }

            public async Task<Result<string>> Handle(SendVerificationEmailCommand request, CancellationToken cancellationToken)
            {
                return await _identityService.SendVerificationEmailAsync(request.Email, request.Origin);
            }
        }
    }
}