namespace Application.Handlers.Identity.Queries
{
    using Application.Interfaces.Identity;

    using MediatR;

    using Models.Role;

    using Shared;
    public class GetUsersInRoleQuery : IRequest<Result<List<UserInRoleDto>>>
    {
        public string RoleName { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public class GetUsersInRoleQueryHandler : IRequestHandler<GetUsersInRoleQuery, Result<List<UserInRoleDto>>>
        {
            private readonly IRoleService _roleService;

            public GetUsersInRoleQueryHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<List<UserInRoleDto>>> Handle(GetUsersInRoleQuery request, CancellationToken cancellationToken)
            {
                return await _roleService.GetUsersInRoleAsync(request.RoleName, request.PageNumber, request.PageSize);
            }
        }
    }
}