namespace Application.Handlers.Account.Queries
{
    using MediatR;

    using Shared;

    using Models.Enums;
    using Application.Interfaces.Identity;
    using Models.Account;

    public class GetUserQuery : IRequest<Result<UserResponseGetModel>>
    {
        public FindBy FindBy { get; set; }
        public string Value { get; set; }

        public GetUserQuery(FindBy findBy, string value)
        {
            this.FindBy = findBy;
            this.Value = value;
        }

        public class GetUserQueryHandler : IRequestHandler<GetUserQuery, Result<UserResponseGetModel>>
        {
            private readonly IUserService userService;

            public GetUserQueryHandler(IUserService userService)
            {
                this.userService = userService;
            }

            public async Task<Result<UserResponseGetModel>> Handle(GetUserQuery request, CancellationToken cancellationToken)
            {
                var result = new Result<UserResponseGetModel>();

                var findBy = request.FindBy;

                if (findBy == FindBy.Email)
                {
                    result = await userService.GetByEmailAsync(request.Value, cancellationToken);
                }
                else
                {
                    result = await userService.GetByIdAsync(request.Value, cancellationToken);
                }

                if (result == null)
                {
                    return Result<UserResponseGetModel>.Failure("User was not found.");
                }

                return result;
            }
        }
    }
}