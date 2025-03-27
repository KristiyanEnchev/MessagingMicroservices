namespace Application.Handlers.Notification
{
    using Application.Interfaces.Post;

    using Domain.Events.Identity;
    using Domain.Events.Identity.TwoFactor;
    using MediatR;

    public class UserEventNotificationHandler :
        INotificationHandler<UserRegisteredEvent>,
        INotificationHandler<EmailConfirmedEvent>,
        INotificationHandler<TwoFactorEnabledEvent>,
        INotificationHandler<TwoFactorDisabledEvent>,
        INotificationHandler<AccountUnlockedEvent>,
        INotificationHandler<UserLockedOutEvent>
    {
        private readonly INotificationService _notificationService;

        public UserEventNotificationHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task Handle(UserRegisteredEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Welcome to our service!",
                "Your account has been successfully created.",
                "welcome");
        }

        public async Task Handle(EmailConfirmedEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Email Verified",
                "Your email address has been successfully verified.",
                "email_verified");
        }

        public async Task Handle(TwoFactorEnabledEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Two-Factor Authentication Enabled",
                "Two-factor authentication has been enabled for your account.",
                "2fa_enabled");
        }

        public async Task Handle(TwoFactorDisabledEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Two-Factor Authentication Disabled",
                "Two-factor authentication has been disabled for your account.",
                "2fa_disabled");
        }

        public async Task Handle(AccountUnlockedEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Account Unlocked",
                "Your account has been unlocked. You can now login.",
                "account_unlocked");
        }

        public async Task Handle(UserLockedOutEvent notification, CancellationToken cancellationToken)
        {
            await _notificationService.SendNotificationAsync(
                notification.UserId,
                "Account Locked",
                $"Your account has been locked until {notification.LockoutEnd}. Please contact support if you need assistance.",
                "account_locked");
        }
    }
}
