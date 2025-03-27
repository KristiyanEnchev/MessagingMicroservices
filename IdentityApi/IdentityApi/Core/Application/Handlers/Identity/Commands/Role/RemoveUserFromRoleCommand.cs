namespace Application.Handlers.Identity.Commands.Role
{
    using System.Threading;
    using System.Threading.Tasks;
    using System.ComponentModel.DataAnnotations;

    using MediatR;

    using Application.Interfaces.Identity;

    using Shared;

    public class RemoveUserFromRoleCommand : IRequest<Result<string>>
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string RoleName { get; set; }

        public class RemoveUserFromRoleCommandHandler : IRequestHandler<RemoveUserFromRoleCommand, Result<string>>
        {
            private readonly IRoleService _roleService;

            public RemoveUserFromRoleCommandHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<string>> Handle(RemoveUserFromRoleCommand request, CancellationToken cancellationToken)
            {
                return await _roleService.RemoveUserFromRoleAsync(request.UserId, request.RoleName);
            }
        }
    }
}