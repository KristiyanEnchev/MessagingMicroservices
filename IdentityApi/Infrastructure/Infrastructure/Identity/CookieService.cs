namespace Infrastructure.Identity
{
    using System.Security.Claims;

    using Microsoft.AspNetCore.Identity;

    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Domain.Entities.Identity;

    using Shared;

    using Models.Identity;
    using Application.Interfaces.Account;

    public class CookieService : ICookieService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IUserActivityService _activityService;
        private readonly IIpAddressService _ipAddressService;

        public CookieService(SignInManager<User> signInManager, UserManager<User> userManager, IUserActivityService activityService, IIpAddressService ipAddressService)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _activityService = activityService;
            _ipAddressService = ipAddressService;
        }

        public async Task<Result<string>> LoginWithCookie(UserRequestModel request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Result<string>.Failure("Invalid credentials.");
            }

            var result = await _signInManager.PasswordSignInAsync(user, request.Password,
                isPersistent: request.RememberMe, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                await _userManager.ResetAccessFailedCountAsync(user);
                await _activityService.LogActivityAsync(
                    user.Id,
                    "CookieLogin",
                    true,
                    $"Cookie login from IP: {_ipAddressService.GetCurrentIpAddress()}");
                return Result<string>.SuccessResult("Login successful");
            }
            else if (result.IsLockedOut)
            {
                var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                var minutesRemaining = Math.Ceiling((lockoutEnd.Value - DateTimeOffset.UtcNow).TotalMinutes);
                return Result<string>.Failure(
                    $"Account is locked due to multiple failed attempts. Try again in {minutesRemaining} minute(s).");
            }
            else
            {
                var attemptsLeft = _userManager.Options.Lockout.MaxFailedAccessAttempts -
                                   await _userManager.GetAccessFailedCountAsync(user);

                await _activityService.LogActivityAsync(
                   user.Id,
                   "CookieLogin",
                   false,
                   $"Failed cookie login from IP: {_ipAddressService.GetCurrentIpAddress()}");

                return Result<string>.Failure(
                    $"Invalid credentials. You have {attemptsLeft} attempt(s) remaining before your account is locked.");
            }
        }

        public async Task<Result<string>> LogoutCookie()
        {
            var userId = _signInManager.Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _signInManager.SignOutAsync();

            if (!string.IsNullOrEmpty(userId))
            {
                await _activityService.LogActivityAsync(
                    userId,
                    "CookieLogout",
                    true,
                    "Cookie logout");
            }
            return Result<string>.SuccessResult("Logged out successfully.");
        }
    }
}
