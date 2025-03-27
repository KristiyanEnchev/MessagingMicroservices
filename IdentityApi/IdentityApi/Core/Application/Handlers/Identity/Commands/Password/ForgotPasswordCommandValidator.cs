namespace Application.Handlers.Identity.Commands.Password
{
    using FluentValidation;

    public class ForgotPasswordCommandValidator : AbstractValidator<ForgotPasswordCommand>
    {
        public ForgotPasswordCommandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("A valid email address is required");

            RuleFor(x => x.ResetPasswordUrl)
                .NotEmpty().WithMessage("Reset password URL is required");
        }
    }
}