namespace Infrastructure.Identity
{
    using System;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.WebUtilities;
    using Microsoft.Extensions.Options;

    using Domain.Entities.Identity;
    using Domain.Events.Identity;
    using Domain.Events.Identity.TwoFactor;

    using Shared;
    using Shared.Interfaces.Repositories;

    using Application.Interfaces;
    using Application.Interfaces.Post;
    using Application.Interfaces.Identity;
    using Application.Interfaces.Account;
    using Application.Handlers.Identity.Commands.Register;

    using Persistence.Constants;

    using Models.Settings;
    using Models.Identity;
    using static System.Net.WebRequestMethods;

    internal class IdentityService : IIdentity
    {
        private const string InvalidErrorMessage = "Invalid credentials.";

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly ITransactionHelper _transactionHelper;
        private readonly IDateTimeService _dateTimeService;
        private readonly IOtpService _otpService;
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly INotificationService _notificationService;
        private readonly IIpAddressService _ipAddressService;
        private readonly IUserActivityService _activityService;
        private readonly ApplicationSettings _applicationSettings;

        public IdentityService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IJwtGenerator jwtGenerator,
            ITransactionHelper transactionHelper,
            IDateTimeService dateTimeService,
            IUserActivityService activityService,
            IOptions<ApplicationSettings> applicationSettings,
            IOtpService otpService = null,
            IEmailService emailService = null,
            ISmsService smsService = null,
            INotificationService notificationService = null,
            IIpAddressService ipAddressService = null)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            _transactionHelper = transactionHelper;
            _dateTimeService = dateTimeService;
            _otpService = otpService;
            _emailService = emailService;
            _smsService = smsService;
            _applicationSettings = applicationSettings!.Value;
            _notificationService = notificationService;
            _ipAddressService = ipAddressService;
            _activityService = activityService;
        }

        public async Task<Result<string>> Register(UserRegisterRequestModel userRequest)
        {
            var userExists = await _userManager.FindByEmailAsync(userRequest.Email);
            if (userExists != null)
            {
                return Result<string>.Failure("Email already in use.");
            }

            var user = new User
            {
                FirstName = userRequest.FirstName,
                LastName = userRequest.LastName,
                Email = userRequest.Email,
                UserName = userRequest.Email,
                IsActive = true,
                CreatedBy = "Registration",
                CreatedDate = _dateTimeService.NowUtc
            };

            if (!_applicationSettings.UseMicroservices) user.EmailConfirmed = true;

            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                try
                {
                    var createUserResult = await _userManager.CreateAsync(user, userRequest.Password);
                    if (!createUserResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = createUserResult.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    var addToRoleResult = await _userManager.AddToRoleAsync(user, Roles.User);
                    if (!addToRoleResult.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = addToRoleResult.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure($"Registration failed: {ex.Message}");
                }
            }

            var userRegisteredEvent = new UserRegisteredEvent(
                user.Id,
                userRequest.FirstName,
                user.LastName);

            user.AddDomainEvent(userRegisteredEvent);

            if (_applicationSettings.UseMicroservices && _notificationService != null)
            {
                await SendVerificationEmailAsync(userRequest.Email);

                await _notificationService.SendNotificationAsync(
                    user.Id,
                    "Welcome!",
                    "Your email has been confirmed. Your account is now active.",
                    "welcome");
            }

            return Result<string>.SuccessResult("Registration successful! Please verify your email to activate your account.");
        }

        public async Task<Result<string>> SendVerificationEmailAsync(string email)
        {
            var origin = _ipAddressService.GetOriginFromRequest();

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return Result<string>.Failure("User not found.");
            }

            string emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            string encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

            var result = await _otpService.GenerateOtpAsync(user.Id, "EmailVerification");

            if (!result.Success || string.IsNullOrEmpty(result.Data.Otp) || string.IsNullOrEmpty((result.Data.TransactionId)))
            {
                return Result<string>.Failure("Failed to generate verification code.");
            }

            string route = "api/email/confirm";
            var endpointUri = new Uri(string.Concat($"{origin}/", route));

            string verificationUri = QueryHelpers.AddQueryString(endpointUri.ToString(), "email", user.Email);
            verificationUri = QueryHelpers.AddQueryString(verificationUri, "token", encodedToken);
            verificationUri = QueryHelpers.AddQueryString(verificationUri, "otp", result.Data.Otp);
            verificationUri = QueryHelpers.AddQueryString(verificationUri, "tid", result.Data.TransactionId);

            if (_emailService != null)
            {
                var emailSent = await _emailService.SendVerificationEmailAsync(
                    user.Email,
                    verificationUri);

                if (!emailSent)
                {
                    return Result<string>.Failure("Failed to send verification email.");
                }
            }

            return Result<string>.SuccessResult("Verification email sent successfully.");
        }

        public async Task<Result<UserResponseModel>> Login(UserRequestModel userRequest)
        {
            var email = userRequest.Email.Trim().Normalize();
            var userResult = await FindUserByEmail(email);
            if (!userResult.Success)
                return Result<UserResponseModel>.Failure(InvalidErrorMessage);

            var user = userResult.Data;

            if (!user.IsActive)
                return Result<UserResponseModel>.Failure("Account is disabled.");

            if (!user.EmailConfirmed)
                return Result<UserResponseModel>.Failure("Email not confirmed. Please verify your email before logging in.");

            var lockoutResult = await IsUserLockedOut(user.Id);
            if (lockoutResult.Success && lockoutResult.Data)
            {
                var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                var minutes = Math.Ceiling((lockoutEnd!.Value - DateTimeOffset.UtcNow).TotalMinutes);
                return Result<UserResponseModel>.Failure($"Account is locked. Try again in {minutes} minute(s).");
            }

            var signInResult = await _signInManager.PasswordSignInAsync(user, userRequest.Password, false, true);
            if (signInResult.IsLockedOut)
            {
                var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                var minutes = Math.Ceiling((lockoutEnd!.Value - DateTimeOffset.UtcNow).TotalMinutes);

                user.AddDomainEvent(new UserLockedOutEvent(user.Id, user.Email, lockoutEnd));

                if (_applicationSettings.UseMicroservices && _notificationService != null)
                {
                    await _notificationService.SendNotificationAsync(
                    user.Id,
                    "Account Temporarily Locked",
                    $"Your account has been locked due to multiple failed login attempts. Try again in {minutes} minute(s).",
                    "account_locked");
                }

                return Result<UserResponseModel>.Failure(
                    $"Account is locked due to multiple failed attempts. Try again in {minutes} minute(s).");
            }

            if (signInResult.RequiresTwoFactor)
            {
                var generateResult = await Generate2FACodeAsync(user.Id);
                if (!generateResult.Success)
                    return Result<UserResponseModel>.Failure(generateResult.Errors);

                await _activityService.LogActivityAsync(
                    user.Id,
                    "Login",
                    true,
                    $"Login successful, 2FA required. IP: {_ipAddressService.GetCurrentIpAddress()}");

                return Result<UserResponseModel>.SuccessResult(
                    new UserResponseModel(null, DateTime.MinValue, null, true));
            }

            if (!signInResult.Succeeded)
            {
                var attemptsLeft = _userManager.Options.Lockout.MaxFailedAccessAttempts -
                                  await _userManager.GetAccessFailedCountAsync(user);

                await _activityService.LogActivityAsync(
                    user.Id,
                    "Login",
                    false,
                    $"Failed login attempt from IP: {_ipAddressService.GetCurrentIpAddress()}");

                return Result<UserResponseModel>.Failure(
                    $"Invalid credentials. You have {attemptsLeft} attempt(s) remaining before your account is locked.");
            }

            await _activityService.LogActivityAsync(
                user.Id,
                "Login",
                true,
                $"Login successful from IP: {_ipAddressService.GetCurrentIpAddress()}");

            await ResetAccessFailedCount(user.Id);

            var tokenResult = await _jwtGenerator.GenerateToken(user);
            return Result<UserResponseModel>.SuccessResult(tokenResult);
        }

        public async Task<Result<UserResponseModel>> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var user = await _jwtGenerator.ValidateRefreshToken(refreshToken);

                var tokenResult = await _jwtGenerator.GenerateToken(user);

                return Result<UserResponseModel>.SuccessResult(tokenResult);
            }
            catch (Exception ex)
            {
                return Result<UserResponseModel>.Failure(ex.Message);
            }
        }

        public async Task<Result<string>> LogoutAsync(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);

            if (user != null)
            {
                await _jwtGenerator.RemoveAuthenticationToken(user);
                await _activityService.LogActivityAsync(
                    user.Id,
                    "Logout",
                    true,
                    "User logged out");
            }

            await _signInManager.SignOutAsync();

            return Result<string>.SuccessResult("Logout successful!");
        }

        public async Task<Result<string>> ConfirmEmail(string userEmail, string code, string otp = null)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(userEmail);
                    if (user == null || code == null)
                    {
                        return Result<string>.Failure("User not found or invalid confirmation code.");
                    }

                    code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));

                    var result = await _userManager.ConfirmEmailAsync(user, code);
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = result.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    var emailConfirmedEvent = new EmailConfirmedEvent(user.Id, user.Email);
                    user.AddDomainEvent(emailConfirmedEvent);

                    await transaction.CommitAsync();

                    return Result<string>.SuccessResult($"Email confirmed for {userEmail}. You can now log in.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure($"Email confirmation failed: {ex.Message}");
                }
            }
        }

        public async Task<Result<string>> SendVerificationEmailAsync(string email, string origin)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return Result<string>.Failure("User not found.");
            }

            string emailVerificationUri = await GetEmailVerificationUriAsync(user, origin);

            if (_emailService != null)
            {
                var emailSent = await _emailService.SendVerificationEmailAsync(
                    user!.Email,
                    emailVerificationUri);

                if (emailSent)
                {
                    return Result<string>.SuccessResult($"Verification email sent to {email}.");
                }
                else
                {
                    return Result<string>.Failure("Failed to send verification email. Please try again later.");
                }
            }

            return Result<string>.SuccessResult(emailVerificationUri);
        }

        public async Task<string> GetEmailVerificationUriAsync(User user, string origin)
        {
            string code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));

            string route = "/confirm-email";
            var endpointUri = new Uri(string.Concat($"{origin}/", route));
            string verificationUri = QueryHelpers.AddQueryString(endpointUri.ToString(), "email", user.Email);
            verificationUri = QueryHelpers.AddQueryString(verificationUri, "code", code);

            return verificationUri;
        }

        public async Task<Result<string>> UnlockUserAccount(string userEmail)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(userEmail);
                    if (user == null)
                    {
                        return Result<string>.Failure("User not found.");
                    }

                    var result = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = result.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    var accountUnlockedEvent = new AccountUnlockedEvent(user.Id, user.Email);
                    user.AddDomainEvent(accountUnlockedEvent);

                    await transaction.CommitAsync();

                    return Result<string>.SuccessResult($"Account unlocked for {userEmail}.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure($"Failed to unlock account: {ex.Message}");
                }
            }
        }

        public async Task<Result<TwoFactorCodeResult>> Generate2FACodeAsync(string userId)
        {
            var userResult = await FindUserById(userId);
            if (!userResult.Success)
                return Result<TwoFactorCodeResult>.Failure(userResult.Errors);

            var user = userResult.Data;

            if (_applicationSettings.UseMicroservices) 
            {
                return await UserMicroserviceCalls(user);
            }

            var dto = new TwoFactorCodeResult
            {
                TransactionId = Guid.NewGuid().ToString(),
                Message = $"Manual delivery fallback. Code: 123456"
            };

            return Result<TwoFactorCodeResult>.SuccessResult(dto);
        }

        private async Task<Result<TwoFactorCodeResult>> UserMicroserviceCalls(User user)
        {
            var result = await _otpService.GenerateOtpAsync(user.Id, "TwoFactorAuth");
            if (!result.Success || string.IsNullOrEmpty(result.Data.Otp) || string.IsNullOrEmpty(result.Data.TransactionId))
                return Result<TwoFactorCodeResult>.Failure("Failed to generate verification code.");

            var otp = result.Data.Otp;
            var transactionId = result.Data.TransactionId;

            var dto = new TwoFactorCodeResult
            {
                TransactionId = transactionId,
            };

            bool deliverySuccess = false;

            if (_emailService != null && !string.IsNullOrEmpty(user.Email))
            {
                deliverySuccess = await _emailService.SendOtpEmailAsync(user.Email, otp);
                if (deliverySuccess)
                    dto.Message = "OTP sent to email.";
            }

            if (!deliverySuccess && _smsService != null && !string.IsNullOrEmpty(user.PhoneNumber))
            {
                var smsResult = await _smsService.SendOtpSmsAsync(user.PhoneNumber, otp);
                if (!smsResult.Success)
                    return Result<TwoFactorCodeResult>.Failure(smsResult.Errors);

                dto.Message = "OTP sent via SMS.";
            }

            if (!deliverySuccess)
                dto.Message = $"Manual delivery fallback. Code: {otp}";

            return Result<TwoFactorCodeResult>.SuccessResult(dto);
        }

        public async Task<Result<UserResponseModel>> Verify2FACode(string userId, string code, string transactionId)
        {
            var userResult = await FindUserById(userId);
            if (!userResult.Success)
                return Result<UserResponseModel>.Failure(userResult.Errors);

            var user = userResult.Data;

            bool isValid = false;
            if (_applicationSettings.UseMicroservices && _otpService != null)
            {
                var resutl = await _otpService.ValidateOtpAsync(transactionId, code, userId);
                isValid = resutl.Data;
            }
            else
            {
                isValid = true;
            }

            if (!isValid)
            {
                return Result<UserResponseModel>.Failure(new List<string> { "Invalid verification code." });
            }

            var tokenResult = await _jwtGenerator.GenerateToken(user);
            return Result<UserResponseModel>.SuccessResult(tokenResult);
        }

        public async Task<Result<string>> EnableTwoFactorAuthentication(string userEmail)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(userEmail);
                    if (user == null)
                    {
                        return Result<string>.Failure("User not found.");
                    }

                    var result = await _userManager.SetTwoFactorEnabledAsync(user, true);
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = result.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    var twoFactorEnabledEvent = new TwoFactorEnabledEvent(user.Id, user.Email);
                    user.AddDomainEvent(twoFactorEnabledEvent);

                    await transaction.CommitAsync();

                    return Result<string>.SuccessResult($"Two-factor authentication enabled for {userEmail}.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure($"Failed to enable two-factor authentication: {ex.Message}");
                }
            }
        }

        public async Task<Result<string>> DisableTwoFactorAuthentication(string userEmail)
        {
            using (var transaction = await _transactionHelper.BeginTransactionAsync())
            {
                try
                {
                    var user = await _userManager.FindByEmailAsync(userEmail);
                    if (user == null)
                    {
                        return Result<string>.Failure("User not found.");
                    }

                    var result = await _userManager.SetTwoFactorEnabledAsync(user, false);
                    if (!result.Succeeded)
                    {
                        await transaction.RollbackAsync();
                        var errors = result.Errors.Select(e => e.Description).ToList();
                        return Result<string>.Failure(errors);
                    }

                    var twoFactorDisabledEvent = new TwoFactorDisabledEvent(user.Id, user.Email);
                    user.AddDomainEvent(twoFactorDisabledEvent);

                    await transaction.CommitAsync();

                    return Result<string>.SuccessResult($"Two-factor authentication disabled for {userEmail}.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return Result<string>.Failure($"Failed to disable two-factor authentication: {ex.Message}");
                }
            }
        }

        private async Task<Result<User>> FindUserByEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null
                ? Result<User>.SuccessResult(user)
                : Result<User>.Failure("User not found.");
        }

        private async Task<Result<User>> FindUserById(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user != null
                ? Result<User>.SuccessResult(user)
                : Result<User>.Failure("User not found.");
        }

        public async Task<Result<string>> LockUserAccount(string userId, DateTimeOffset? endDate = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Result<string>.Failure("User not found.");

            var lockoutEnd = endDate ?? DateTimeOffset.UtcNow.AddHours(1);
            await _userManager.SetLockoutEndDateAsync(user, lockoutEnd);

            user.AddDomainEvent(new UserLockedOutEvent(user.Id, user.Email, lockoutEnd));

            return Result<string>.SuccessResult($"User account locked until {lockoutEnd}");
        }

        private async Task<Result<bool>> IsUserLockedOut(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user != null
                ? Result<bool>.SuccessResult(await _userManager.IsLockedOutAsync(user))
                : Result<bool>.Failure("User not found.");
        }

        private async Task<Result<string>> ResetAccessFailedCount(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Result<string>.Failure("User not found.");

            await _userManager.ResetAccessFailedCountAsync(user);
            return Result<string>.SuccessResult("Access failed count has been reset.");
        }
    }
}