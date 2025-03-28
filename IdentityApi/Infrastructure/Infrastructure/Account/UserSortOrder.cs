namespace Infrastructure.Account
{
    using System.Linq.Expressions;

    using Application.Common;

    using Domain.Entities.Identity;

    public class UserSortOrder : SortOrder<User>
    {
        public UserSortOrder(string? sortBy, string? order)
            : base(sortBy, order)
        {
        }

        public override Expression<Func<User, object>> ToExpression()
            => SortBy switch
            {
                "email" => User => User.Email!,
                "firstName" => User => User.FirstName!,
                "lastName" => User => User.LastName!,
                _ => User => User.Id
            };
    }
}
