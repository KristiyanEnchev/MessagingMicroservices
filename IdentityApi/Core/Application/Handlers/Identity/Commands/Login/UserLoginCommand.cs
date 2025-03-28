namespace Application.Handlers.Identity.Commands.Login
{
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Shared;

    using Models.Identity;

    using Application.Interfaces.Identity;

    public class UserLoginCommand : UserRequestModel, IRequest<Result<UserResponseModel>>
    {
        public UserLoginCommand(string email, string password, bool rememberMe)
            : base(email, password, rememberMe)
        {
        }

        public class UserLoginCommandHandler : IRequestHandler<UserLoginCommand, Result<UserResponseModel>>
        {
            private readonly IIdentity identity;

            public UserLoginCommandHandler(IIdentity identity)
            {
                this.identity = identity;
            }

            public async Task<Result<UserResponseModel>> Handle(UserLoginCommand request, CancellationToken cancellationToken)
            {
                var result = await identity.Login(request);

                return result;
            }
        }
    }
}