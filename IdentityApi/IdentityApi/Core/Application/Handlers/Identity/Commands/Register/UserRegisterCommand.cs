namespace Application.Handlers.Identity.Commands.Register
{
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Shared;

    using Application.Interfaces.Identity;

    public class UserRegisterCommand : UserRegisterRequestModel, IRequest<Result<string>>
    {
        public UserRegisterCommand(string firstName, string lastName, string email, string password, string confirmPassword, bool rememberMe)
            : base(firstName, lastName, email, password, rememberMe)
        {
            ConfirmPassword = confirmPassword;
        }

        public string ConfirmPassword { get; }

        public class UserRegisterCommandHandler : IRequestHandler<UserRegisterCommand, Result<string>>
        {
            private readonly IIdentity identity;

            public UserRegisterCommandHandler(IIdentity identity)
            {
                this.identity = identity;
            }

            public async Task<Result<string>> Handle(UserRegisterCommand request, CancellationToken cancellationToken)
            {
                var result = await identity.Register(request);

                return result;
            }
        }
    }
}