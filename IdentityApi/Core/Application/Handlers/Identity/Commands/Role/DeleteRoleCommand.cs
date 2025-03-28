namespace Application.Handlers.Identity.Commands.Role
{
    using System.ComponentModel.DataAnnotations;

    using Application.Interfaces.Identity;

    using MediatR;

    using Shared;

    public class DeleteRoleCommand : IRequest<Result<string>>
    {
        [Required]
        public string RoleName { get; set; }

        public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Result<string>>
        {
            private readonly IRoleService _roleService;

            public DeleteRoleCommandHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<string>> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
            {
                return await _roleService.DeleteRoleAsync(request.RoleName);
            }
        }
    }
}