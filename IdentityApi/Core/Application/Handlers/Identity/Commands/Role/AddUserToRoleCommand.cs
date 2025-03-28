namespace Application.Handlers.Identity.Commands.Role
{
    using System.ComponentModel.DataAnnotations;

    using Application.Interfaces.Identity;

    using MediatR;

    using Shared;

    public class AddUserToRoleCommand : IRequest<Result<string>>
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string RoleName { get; set; }

        public class AddUserToRoleCommandHandler : IRequestHandler<AddUserToRoleCommand, Result<string>>
        {
            private readonly IRoleService _roleService;

            public AddUserToRoleCommandHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<string>> Handle(AddUserToRoleCommand request, CancellationToken cancellationToken)
            {
                return await _roleService.AddUserToRoleAsync(request.UserId, request.RoleName);
            }
        }
    }
}