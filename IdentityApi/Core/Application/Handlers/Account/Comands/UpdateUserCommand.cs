namespace Application.Handlers.Account.Comands
{
    using MediatR;

    using Shared;

    using Application.Interfaces.Identity;
    using Models.Account;

    public class UpdateUserCommand : UserUpdateRequestModel, IRequest<Result<UserResponseGetModel>>
    {
        public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<UserResponseGetModel>>
        {
            private readonly IUserService _userService;

            public UpdateUserCommandHandler(IUserService userService)
            {
                _userService = userService;
            }

            public async Task<Result<UserResponseGetModel>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
            {
                var result = await _userService.UpdateUserData(
                    request.Id!,
                    request.FirstName!,
                    request.LastName!,
                    request.UserName!,
                    request.Email!,
                    cancellationToken);

                return result;
            }
        }
    }
}