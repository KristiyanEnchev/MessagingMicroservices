namespace Persistence.Repositories
{
    using System.Collections.Generic;

    using Microsoft.EntityFrameworkCore;

    using Domain.Common;

    using Persistence.Contexts;
    using Shared.Interfaces.Repositories;

    public class GenericRepository<T> : IGenericRepository<T> where T : BaseAuditableEntity
    {
        private readonly ApplicationDbContext _dbContext;

        public GenericRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IQueryable<T> Entities => _dbContext.Set<T>();
        public IQueryable<T> All() => _dbContext.Set<T>();
        public IQueryable<T> AllAsNoTracking() => All().AsNoTracking();
        protected DbSet<T> DbSet() => _dbContext.Set<T>();
        public async Task<T> GetByIdAsync(object id) => await _dbContext.Set<T>().FindAsync(id);
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbContext
                .Set<T>()
                .ToListAsync();
        }
        public void Add(T entity) => DbSet().Add(entity);
        public async Task<T> AddAsync(T entity)
        {
            await _dbContext.Set<T>().AddAsync(entity);
            return entity;
        }
        public int SaveChanges() => _dbContext.SaveChanges();
        public virtual void Update(T entity)
        {
            var entry = this._dbContext.Entry(entity);

            if (entry.State == EntityState.Detached)
            {
                this.DbSet().Attach(entity);
            }
            entry.State = EntityState.Modified;
        }
        public Task UpdateAsync(T entity)
        {
            T exist = _dbContext.Set<T>().Find(entity.Id);
            _dbContext.Entry(exist).CurrentValues.SetValues(entity);
            return Task.CompletedTask;
        }
        public virtual void Delete(T entity) => this.DbSet().Remove(entity);
        public Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            return Task.CompletedTask;
        }
    }
}