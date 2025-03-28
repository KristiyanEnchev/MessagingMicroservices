namespace Infrastructure.Identity
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;

    using Domain.Entities.Identity;

    using Shared;

    using Application.Interfaces;
    using Application.Interfaces.Identity;
    using Application.Interfaces.Account;

    using Domain.Events.Identity.Roles;

    using Models.Role;

    public class RoleService : IRoleService
    {
        private readonly RoleManager<UserRole> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserActivityService _userActivityService;
        private readonly IUser _currentUser;

        public RoleService(
            RoleManager<UserRole> roleManager,
            UserManager<User> userManager,
            IUserActivityService userActivityService,
            IUser currentUser)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _userActivityService = userActivityService;
            _currentUser = currentUser;
        }

        public async Task<Result<List<string>>> GetRolesAsync()
        {
            var roles = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            return Result<List<string>>.SuccessResult(roles);
        }

        public async Task<Result<RoleResult>> CreateRoleAsync(string roleName)
        {
            var role = new UserRole(roleName);
            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "CreateRole",
                    false,
                    $"Failed to create role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");

                return Result<RoleResult>.Failure(result.Errors.Select(e => e.Description).ToList());
            }

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "CreateRole",
                true,
                $"Created role '{roleName}'");

            var roleCreatedEvent = new RoleCreatedEvent(roleName, _currentUser.Id);

            role.AddDomainEvent(roleCreatedEvent);

            return Result<RoleResult>.SuccessResult(new RoleResult { RoleName = roleName, Message = $"Role '{roleName}' created successfully." });
        }

        public async Task<Result<string>> DeleteRoleAsync(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "DeleteRole",
                    false,
                    $"Attempted to delete non-existent role '{roleName}'");

                return Result<string>.Failure("Role not found.");
            }

            // Check if any users are in this role
            var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
            if (usersInRole.Any())
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "DeleteRole",
                    false,
                    $"Cannot delete role '{roleName}' because it has {usersInRole.Count} users assigned");

                return Result<string>.Failure($"Cannot delete role '{roleName}' because it has users assigned to it. Remove all users from this role first.");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "DeleteRole",
                    false,
                    $"Failed to delete role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");

                return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
            }

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "DeleteRole",
                true,
                $"Deleted role '{roleName}'");

            var roleDeletedEvent = new RoleDeletedEvent(roleName, _currentUser.Id);
            role.AddDomainEvent(roleDeletedEvent);

            return Result<string>.SuccessResult($"Role '{roleName}' deleted successfully.");
        }

        public async Task<Result<string>> AddUserToRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "AddUserToRole",
                    false,
                    $"Attempted to add non-existent user (ID: {userId}) to role '{roleName}'");

                return Result<string>.Failure("User not found.");
            }

            // Check if role exists
            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "AddUserToRole",
                    false,
                    $"Attempted to add user to non-existent role '{roleName}'");

                return Result<string>.Failure($"Role '{roleName}' does not exist.");
            }

            // Check if user is already in the role
            if (await _userManager.IsInRoleAsync(user, roleName))
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "AddUserToRole",
                    false,
                    $"User already has role '{roleName}'");

                return Result<string>.Failure($"User already has the role '{roleName}'.");
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "AddUserToRole",
                    false,
                    $"Failed to add user to role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");

                return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
            }

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "AddUserToRole",
                true,
                $"Added user {user.Email} to role '{roleName}'");

            user.AddDomainEvent(new UserAddedToRoleEvent(user.Id, roleName));

            return Result<string>.SuccessResult($"User added to role '{roleName}' successfully.");
        }

        public async Task<Result<string>> RemoveUserFromRoleAsync(string userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "RemoveUserFromRole",
                    false,
                    $"Attempted to remove non-existent user (ID: {userId}) from role '{roleName}'");

                return Result<string>.Failure("User not found.");
            }

            // Check if user is in the role
            if (!await _userManager.IsInRoleAsync(user, roleName))
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "RemoveUserFromRole",
                    false,
                    $"User does not have role '{roleName}'");

                return Result<string>.Failure($"User does not have the role '{roleName}'.");
            }

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            if (!result.Succeeded)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "RemoveUserFromRole",
                    false,
                    $"Failed to remove user from role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");

                return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
            }

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "RemoveUserFromRole",
                true,
                $"Removed user {user.Email} from role '{roleName}'");

            user.AddDomainEvent(new UserRemovedFromRoleEvent(user.Id, roleName));

            return Result<string>.SuccessResult($"User removed from role '{roleName}' successfully.");
        }

        public async Task<Result<List<string>>> GetUserRolesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "GetUserRoles",
                    false,
                    $"Attempted to get roles for non-existent user (ID: {userId})");

                return Result<List<string>>.Failure("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(user);

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "GetUserRoles",
                true,
                $"Retrieved roles for user {user.Email}");

            return Result<List<string>>.SuccessResult(roles.ToList());
        }

        public async Task<Result<List<UserInRoleDto>>> GetUsersInRoleAsync(string roleName, int pageNumber = 1, int pageSize = 10)
        {
            // Check if role exists
            var roleExists = await _roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                await _userActivityService.LogActivityAsync(
                    _currentUser.Id,
                    "GetUsersInRole",
                    false,
                    $"Attempted to get users for non-existent role '{roleName}'");

                return Result<List<UserInRoleDto>>.Failure($"Role '{roleName}' does not exist.");
            }

            // Get all users in the role
            var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);

            // Apply pagination
            var pagedUsers = usersInRole
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserInRoleDto
                {
                    UserId = u.Id,
                    UserName = u.UserName,
                    Email = u.Email,
                    FullName = $"{u.FirstName} {u.LastName}"
                })
                .ToList();

            await _userActivityService.LogActivityAsync(
                _currentUser.Id,
                "GetUsersInRole",
                true,
                $"Retrieved users in role '{roleName}', page {pageNumber}, size {pageSize}");

            return Result<List<UserInRoleDto>>.SuccessResult(pagedUsers);
        }
    }
}
