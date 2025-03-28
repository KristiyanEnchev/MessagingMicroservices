namespace Application.Interfaces.Identity
{
    using Models.Account;
    using Models.Enums;

    using Shared;

    public interface IUserService
    {
        Task<Result<List<UserResponseGetModel>>> GetListAsync(CancellationToken cancellationToken);
        Task<PaginatedResult<UserResponseGetModel>> GetPagedListAsync(
            int pageNumber,
            int pageSize,
            string sortBy,
            string order,
            CancellationToken cancellationToken);

        Task<Result<UserResponseGetModel>> GetByIdAsync(string userId, CancellationToken cancellationToken);
        Task<Result<UserResponseGetModel>> GetByEmailAsync(string userId, CancellationToken cancellationToken);
        Task<Result<string>> ToggleStatusAsync(string value, ToggleUserValue toggleValue);
        Task<Result<UserResponseGetModel>> UpdateUserData(
            string id,
            string firstName,
            string lastName,
            string userName,
            string email,
            CancellationToken cancellationToken);

        Task<Result<string>> DeleteUser(string userId, CancellationToken cancellationToken);
    }
}