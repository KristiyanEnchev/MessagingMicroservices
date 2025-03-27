namespace Application.Extensions
{
    using Microsoft.EntityFrameworkCore;

    using Application.Common;

    using Shared;

    public static class QueryableExtensions
    {
        public static async Task<PaginatedResult<T>> ToPaginatedListAsync<T>(this IQueryable<T> source, int pageNumber, int pageSize, CancellationToken cancellationToken) where T : class
        {
            pageNumber = pageNumber == 0 ? 1 : pageNumber;
            pageSize = pageSize == 0 ? 10 : pageSize;
            int count = await source.CountAsync();
            pageNumber = pageNumber <= 0 ? 1 : pageNumber;
            List<T> items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
            return PaginatedResult<T>.Create(items, count, pageNumber, pageSize);
        }

        public static IQueryable<T> Sort<T>(this IQueryable<T> queryable, SortOrder<T> sortOrder)
        {
            return sortOrder.Order == SortOrder<T>.Descending
                    ? queryable.OrderByDescending(sortOrder.ToExpression())
                    : queryable.OrderBy(sortOrder.ToExpression());
        }
    }
}
