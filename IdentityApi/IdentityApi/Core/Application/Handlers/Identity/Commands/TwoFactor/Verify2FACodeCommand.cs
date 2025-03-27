namespace Application.Handlers.Identity.Commands.TwoFactor
{
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Shared;

    using Application.Interfaces.Identity;

    using Models.Identity;

    public class Verify2FACodeCommand : IRequest<Result<UserResponseModel>>
    {
        public string UserId { get; }
        public string Code { get; }
        public string TransactionId { get; }

        public Verify2FACodeCommand(string userId, string code, string transactionId)
        {
            UserId = userId;
            Code = code;
            TransactionId = transactionId;
        }

        public class Verify2FACodeCommandHandler : IRequestHandler<Verify2FACodeCommand, Result<UserResponseModel>>
        {
            private readonly IIdentity _identityService;

            public Verify2FACodeCommandHandler(IIdentity identityService)
            {
                _identityService = identityService;
            }

            public async Task<Result<UserResponseModel>> Handle(Verify2FACodeCommand request, CancellationToken cancellationToken)
            {
                return await _identityService.Verify2FACode(request.UserId, request.Code, request.TransactionId);
            }
        }
    }
}