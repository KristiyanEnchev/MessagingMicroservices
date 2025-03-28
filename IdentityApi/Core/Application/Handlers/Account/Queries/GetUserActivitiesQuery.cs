namespace Application.Handlers.Account.Queries
{
    using Application.Interfaces;
    using Application.Interfaces.Account;
    using AutoMapper;

    using MediatR;

    using Models.Account;

    using Shared;

    public class GetUserActivitiesQuery : IRequest<Result<List<UserActivityModel>>>
    {
        public int Take { get; set; }

        public GetUserActivitiesQuery(int take)
        {
            this.Take = take;
        }

        public class GetUserActivitiesQueryHandler : IRequestHandler<GetUserActivitiesQuery, Result<List<UserActivityModel>>>
        {
            private readonly IUserActivityService _userActivityService;
            private readonly IUser _currentUser;
            private readonly IMapper _mapper;

            public GetUserActivitiesQueryHandler(
                IUserActivityService userActivityService,
                IUser currentUser,
                IMapper mapper)
            {
                _userActivityService = userActivityService;
                _currentUser = currentUser;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityModel>>> Handle(GetUserActivitiesQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(_currentUser.Id))
                {
                    return Result<List<UserActivityModel>>.Failure("User not authenticated");
                }

                var allActivities = await _userActivityService.GetUserActivitiesAsync(_currentUser.Id, request.Take);

                var recentActivities = _mapper.Map<List<UserActivityModel>>(allActivities);

                return Result<List<UserActivityModel>>.SuccessResult(recentActivities);
            }
        }
    }
}