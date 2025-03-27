namespace Application.Handlers.Identity.Commands.User
{
    using MediatR;

    using Shared;

    using Application.Interfaces.Identity;

    public class ConfirmEmailCommand : IRequest<Result<string>>
    {
        public string? Email { get; set; }
        public string? Code { get; set; }
        public string? Otp { get; set; }

        public ConfirmEmailCommand(string email, string code, string otp)
        {
            this.Email = email;
            this.Code = code;
            this.Otp = otp;
        }


        public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, Result<string>> 
        {
            private readonly IIdentity _identity;

            public ConfirmEmailCommandHandler(IIdentity identity)
            {
                _identity = identity;
            }

            public async Task<Result<string>> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken) 
            {
                var result = await _identity.ConfirmEmail(request.Email!, request.Code!, request.Otp!);

                return result;
            }
        }
    }
}
