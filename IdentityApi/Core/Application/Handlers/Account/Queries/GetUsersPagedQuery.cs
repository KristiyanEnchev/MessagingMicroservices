namespace Application.Handlers.Account.Queries
{
    using MediatR;

    using Shared;

    using Models.Enums;
    using Application.Interfaces.Identity;
    using Models.Account;

    public class GetUsersPagedQuery : IRequest<PaginatedResult<UserResponseGetModel>>
    {
        public int PageNumber { get; init; } = 1;
        public int PageSize { get; init; } = 10;
        public SortBy BySort { get; }
        public Sort Order { get; }

        public GetUsersPagedQuery(int pageNumber, int pageSize, SortBy sortBy, Sort order)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            BySort = sortBy;
            Order = order;
        }

        public class GetUsersQueryHandler : IRequestHandler<GetUsersPagedQuery, PaginatedResult<UserResponseGetModel>>
        {
            private readonly IUserService userService;

            public GetUsersQueryHandler(IUserService userService)
            {
                this.userService = userService;
            }

            public async Task<PaginatedResult<UserResponseGetModel>> Handle(GetUsersPagedQuery request, CancellationToken cancellationToken)
            {
                var result = await userService.GetPagedListAsync(
                    request.PageNumber,
                    request.PageSize,
                    request.BySort.ToString().ToLower(),
                    request.Order.ToString().ToLower(),
                    cancellationToken);

                return result;
            }
        }
    }
}