namespace Application.Handlers.Identity.Queries
{
    using Application.Interfaces.Identity;

    using MediatR;

    using Shared;

    public class GetUserRolesQuery : IRequest<Result<List<string>>>
    {
        public string UserId { get; set; }

        public class GetUserRolesQueryHandler : IRequestHandler<GetUserRolesQuery, Result<List<string>>>
        {
            private readonly IRoleService _roleService;

            public GetUserRolesQueryHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<List<string>>> Handle(GetUserRolesQuery request, CancellationToken cancellationToken)
            {
                return await _roleService.GetUserRolesAsync(request.UserId);
            }
        }
    }
}