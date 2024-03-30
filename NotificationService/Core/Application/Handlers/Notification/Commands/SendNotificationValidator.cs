namespace Application.Handlers.Notification.Commands
{
    using FluentValidation;

    public class SendNotificationValidator : AbstractValidator<SendNotificationCommand>
    {
        public SendNotificationValidator()
        {
            RuleFor(command => command).NotNull();
            RuleFor(command => command.Type.ToString()).NotEmpty();
        }
    }
}