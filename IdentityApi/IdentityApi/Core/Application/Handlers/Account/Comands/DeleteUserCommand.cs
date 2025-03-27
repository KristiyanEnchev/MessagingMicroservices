namespace Application.Handlers.Account.Comands
{
    using MediatR;

    using Shared;
    using Application.Interfaces.Identity;

    public class DeleteUserCommand : IRequest<Result<string>>
    {
        public string Id { get; set; }

        public DeleteUserCommand(string id)
        {
            this.Id = id;
        }

        public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<String>> 
        {
            private readonly IUserService _userService;

            public DeleteUserCommandHandler(IUserService userService)
            {
                _userService = userService;
            }

            public async Task<Result<string>> Handle(DeleteUserCommand request, CancellationToken cancellationToken) 
            {
                var result = await _userService.DeleteUser(request.Id, cancellationToken);

                return result;
            }
        }
    }
}
