namespace Application.Interfaces.Identity
{
    using Models.Role;

    using Shared;

    public interface IRoleService
    {
        Task<Result<List<string>>> GetRolesAsync();
        Task<Result<RoleResult>> CreateRoleAsync(string roleName);
        Task<Result<string>> DeleteRoleAsync(string roleName);
        Task<Result<string>> AddUserToRoleAsync(string userId, string roleName);
        Task<Result<string>> RemoveUserFromRoleAsync(string userId, string roleName);
        Task<Result<List<string>>> GetUserRolesAsync(string userId);
        Task<Result<List<UserInRoleDto>>> GetUsersInRoleAsync(string roleName, int pageNumber = 1, int pageSize = 10);
    }
}