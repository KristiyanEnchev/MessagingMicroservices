namespace Shared.Interfaces.Repositories
{
    using Microsoft.EntityFrameworkCore.Storage;

    public interface ITransactionHelper
    {
        ValueTask<IDbContextTransaction> BeginTransactionAsync();
        IDbContextTransaction BeginTransaction();
    }
}