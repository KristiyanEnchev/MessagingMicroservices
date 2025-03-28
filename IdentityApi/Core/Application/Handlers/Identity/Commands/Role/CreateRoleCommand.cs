namespace Application.Handlers.Identity.Commands.Role
{
    using System.ComponentModel.DataAnnotations;

    using Application.Interfaces.Identity;

    using MediatR;

    using Models.Role;

    using Shared;

    public class CreateRoleCommand : IRequest<Result<RoleResult>>
    {
        [Required]
        public string RoleName { get; set; }

        public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, Result<RoleResult>>
        {
            private readonly IRoleService _roleService;

            public CreateRoleCommandHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<RoleResult>> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
            {
                return await _roleService.CreateRoleAsync(request.RoleName);
            }
        }
    }
}