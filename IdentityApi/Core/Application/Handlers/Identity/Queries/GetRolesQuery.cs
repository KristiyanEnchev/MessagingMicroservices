namespace Application.Handlers.Identity.Queries
{
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    using MediatR;

    using Application.Interfaces.Identity;

    using Shared;

    public class GetRolesQuery : IRequest<Result<List<string>>>
    {
        public class GetRolesQueryHandler : IRequestHandler<GetRolesQuery, Result<List<string>>>
        {
            private readonly IRoleService _roleService;

            public GetRolesQueryHandler(IRoleService roleService)
            {
                _roleService = roleService;
            }

            public async Task<Result<List<string>>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
            {
                return await _roleService.GetRolesAsync();
            }
        }
    }
}