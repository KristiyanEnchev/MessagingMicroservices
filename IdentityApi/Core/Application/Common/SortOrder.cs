namespace Application.Common
{
    using System.Linq.Expressions;

    public abstract class SortOrder<T>
    {
        public const string Ascending = "asc";
        public const string Descending = "desc";

        protected SortOrder(string? sortBy, string? order)
        {
            this.SortBy = sortBy;
            this.Order = order;
        }

        public string? SortBy { get; }

        public string? Order { get; }

        public abstract Expression<Func<T, object>> ToExpression();
    }
}
