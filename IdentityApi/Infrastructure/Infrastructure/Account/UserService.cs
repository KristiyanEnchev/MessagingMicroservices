namespace Infrastructure.Account
{
    using Microsoft.Extensions.Options;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;

    using AutoMapper;
    using AutoMapper.QueryableExtensions;

    using Domain.Events.Identity;
    using Domain.Entities.Identity;

    using Shared;

    using Persistence.Constants;

    using Application.Interfaces;
    using Application.Extensions;
    using Application.Interfaces.Identity;
    using Models.Enums;
    using Models.Account;
    using Models.Settings;
    using Shared.Interfaces.Repositories;

    public class UserService : IUserService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IMapper _mapper;
        private readonly ITransactionHelper _transactionHelper;
        private readonly IUser _user;
        private readonly ApplicationSettings applicationSettings;


        public UserService(
            UserManager<User> userManager,
            IMapper mapper,
            ITransactionHelper transactionHelper,
            SignInManager<User> signInManager,
            IUser user,
            IOptions<ApplicationSettings> applicationSettings)
        {
            this.userManager = userManager;
            _mapper = mapper;
            _transactionHelper = transactionHelper;
            this.signInManager = signInManager;
            _user = user;
            this.applicationSettings = applicationSettings.Value;
        }

        public async Task<Result<List<UserResponseGetModel>>> GetListAsync(CancellationToken cancellationToken)
        {
            var users = await userManager.Users
                .AsNoTracking()
                .ProjectTo<UserResponseGetModel>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            foreach (var userResponse in users)
            {
                var user = await userManager.FindByIdAsync(userResponse.Id!);
                var roles = await userManager.GetRolesAsync(user!);
                var role = roles.FirstOrDefault();
                userResponse.Role = role;
            }

            return Result<List<UserResponseGetModel>>.SuccessResult(users);
        }

        public async Task<PaginatedResult<UserResponseGetModel>> GetPagedListAsync(
            int pageNumber,
            int pageSize,
            string sortBy,
            string order,
            CancellationToken cancellationToken)
        {
            var sortOrder = new UserSortOrder(sortBy, order);

            var paginatedAndSortedUsers = await userManager.Users
                .AsNoTracking()
                .Sort(sortOrder)
                .ProjectTo<UserResponseGetModel>(_mapper.ConfigurationProvider)
                .ToPaginatedListAsync(pageNumber, pageSize, cancellationToken);

            foreach (var userResponse in paginatedAndSortedUsers.Data)
            {
                var user = await userManager.FindByIdAsync(userResponse.Id!);
                var roles = await userManager.GetRolesAsync(user!);
                var role = roles.FirstOrDefault();
                userResponse.Role = role;
            }

            return paginatedAndSortedUsers;
        }

        public async Task<Result<UserResponseGetModel>> GetByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var user = await userManager.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .ProjectTo<UserResponseGetModel>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return Result<UserResponseGetModel>.Failure("User Not Found.");
            }

            return Result<UserResponseGetModel>.SuccessResult(user);
        }

        public async Task<Result<UserResponseGetModel>> GetByEmailAsync(string email, CancellationToken cancellationToken)
        {
            var user = await userManager.Users
                .AsNoTracking()
                .Where(u => u.Email == email)
                .ProjectTo<UserResponseGetModel>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
            {
                return Result<UserResponseGetModel>.Failure("User Not Found.");
            }

            return Result<UserResponseGetModel>.SuccessResult(user);
        }

        public async Task<Result<string>> ToggleStatusAsync(string value, ToggleUserValue toggleValue)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                var user = await userManager.FindByEmailAsync(value) ?? await userManager.FindByIdAsync(value);
                if (user == null)
                {
                    return Result<string>.Failure("User not found.");
                }

                var changes = new List<string>();
                string propertyChanged = string.Empty;
                bool newValue = false;

                switch (toggleValue)
                {
                    case ToggleUserValue.IsActive:
                        user.IsActive = !user.IsActive;
                        propertyChanged = nameof(user.IsActive);
                        newValue = user.IsActive;
                        break;
                    case ToggleUserValue.IsEmailConfirmed:
                        user.EmailConfirmed = !user.EmailConfirmed;
                        propertyChanged = nameof(user.EmailConfirmed);
                        newValue = user.EmailConfirmed;
                        break;
                    case ToggleUserValue.IsLockedOut:
                        user.LockoutEnabled = !user.LockoutEnabled;
                        propertyChanged = nameof(user.LockoutEnabled);
                        newValue = user.LockoutEnabled;
                        break;
                }

                if (!string.IsNullOrEmpty(propertyChanged))
                {
                    changes.Add(propertyChanged);
                    var userToggleEvent = new UserToggleEvent(user.IsActive, user.EmailConfirmed, user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow, changes);
                    user.AddDomainEvent(userToggleEvent);
                }

                user.UpdatedBy = _user.Id;
                user.UpdatedDate = DateTime.UtcNow;

                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
                }

                await transaction.CommitAsync();
                return Result<string>.SuccessResult($"{propertyChanged} toggled to {newValue}.");
            }
        }

        public async Task<Result<UserResponseGetModel>> UpdateUserData(
            string id,
            string firstName,
            string lastName,
            string userName,
            string email,
            CancellationToken cancellationToken)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                var user = await userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return Result<UserResponseGetModel>.Failure("User not found.");
                }

                var changedProperties = new List<string>();

                if (firstName != null && user.FirstName != firstName)
                {
                    user.FirstName = firstName;
                    changedProperties.Add(nameof(user.FirstName));
                }
                if (lastName != null && user.LastName != lastName)
                {
                    user.LastName = lastName;
                    changedProperties.Add(nameof(user.LastName));
                }
                if (userName != null && user.UserName != userName)
                {
                    user.UserName = userName;
                    changedProperties.Add(nameof(user.UserName));
                }
                if (email != null && user.Email != email)
                {
                    user.Email = email;
                    changedProperties.Add(nameof(user.Email));
                }

                if (!changedProperties.Any())
                {
                    var currentUserRoles = await userManager.GetRolesAsync(user);
                    var currentUserRole = currentUserRoles.FirstOrDefault();
                    var currentUser = _mapper.Map<UserResponseGetModel>(user);
                    currentUser.Role = currentUserRole;
                    return Result<UserResponseGetModel>.SuccessResult(currentUser);
                }

                user.UpdatedBy = _user.Id;
                user.UpdatedDate = DateTime.UtcNow;

                var result = await userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return Result<UserResponseGetModel>.Failure(result.Errors.Select(e => e.Description).ToList());
                }

                await signInManager.RefreshSignInAsync(user);

                user.AddDomainEvent(new ApplicationUserUpdatedEvent(user.Id, changedProperties));

                await transaction.CommitAsync();

                var roles = await userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault();
                var updatedUser = _mapper.Map<UserResponseGetModel>(user);
                updatedUser.Role = role;
                return Result<UserResponseGetModel>.SuccessResult(updatedUser);
            }
        }


        //// Potential dynamic update of properties allowing extention of the properties for update more easy without adding code,
        //// rather just adding the property itself 

        //public async Task<Result<UserResponseGetModel>> UpdateUserData(string userId, UserUpdateRequest updateRequest, CancellationToken cancellationToken)
        //{
        //    using (var transaction = await _transactionHelper.BeginTransactionAsync())
        //    {
        //        var user = await userManager.FindByIdAsync(userId);
        //        if (user == null)
        //        {
        //            return Result<UserResponseGetModel>.Failure("User not found.");
        //        }

        //        var changedProperties = new List<string>();
        //        var userProperties = user.GetType().GetProperties();
        //        foreach (var property in typeof(UserUpdateRequest).GetProperties())
        //        {
        //            var userProperty = userProperties.FirstOrDefault(p => p.Name == property.Name);
        //            if (userProperty != null)
        //            {
        //                var currentValue = userProperty.GetValue(user);
        //                var newValue = property.GetValue(updateRequest);

        //                if (currentValue != null && !currentValue.Equals(newValue))
        //                {
        //                    userProperty.SetValue(user, newValue);
        //                    changedProperties.Add(property.Name);
        //                }
        //            }
        //        }

        //        if (!changedProperties.Any())
        //        {
        //            var currentUser = _mapper.Map<UserResponseGetModel>(user);
        //            return Result<UserResponseGetModel>.SuccessResult(currentUser);
        //        }

        //        var result = await userManager.UpdateAsync(user);
        //        if (!result.Succeeded)
        //        {
        //            await transaction.RollbackAsync();
        //            return Result<UserResponseGetModel>.Failure(result.Errors.Select(e => e.Description).ToList());
        //        }

        //        user.AddDomainEvent(new ApplicationUserUpdatedEvent(user.Id, changedProperties));
        //        await transaction.CommitAsync();

        //        var updatedUser = _mapper.Map<UserResponseGetModel>(user);
        //        return Result<UserResponseGetModel>.SuccessResult(updatedUser);
        //    }
        //}


        public async Task<Result<string>> DeleteUser(string userId, CancellationToken cancellationToken)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return Result<string>.Failure("User not found.");
                }

                var roles = await userManager.GetRolesAsync(user);
                if (roles.Any(x => x.Contains(Roles.Administrator)))
                {
                    return Result<string>.Failure("Can't Delete Administrator User.");
                }

                if (roles.Any())
                {
                    var removeFromRolesResult = await userManager.RemoveFromRolesAsync(user, roles);
                    if (!removeFromRolesResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        return Result<string>.Failure(removeFromRolesResult.Errors.Select(e => e.Description).ToList());
                    }
                }
                await userManager.RemoveAuthenticationTokenAsync(user, applicationSettings.LoginProvider!, applicationSettings!.TokenNames!.RefreshToken!);

                var result = await userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure(result.Errors.Select(e => e.Description).ToList());
                }

                await transaction.CommitAsync();

                user.AddDomainEvent(new ApplicationUserDeletedEvent(user.Id));

                return Result<string>.SuccessResult(userId);
            }
        }
    }
}
