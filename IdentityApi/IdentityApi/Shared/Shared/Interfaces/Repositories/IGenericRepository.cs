namespace Shared.Interfaces.Repositories
{
    using Domain.Interfaces;

    public interface IGenericRepository<T> where T : class, IEntity
    {
        IQueryable<T> All();
        IQueryable<T> AllAsNoTracking();
        IQueryable<T> Entities { get; }
        Task<List<T>> GetAllAsync();
        Task<T> GetByIdAsync(object id);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        int SaveChanges();
    }
}
