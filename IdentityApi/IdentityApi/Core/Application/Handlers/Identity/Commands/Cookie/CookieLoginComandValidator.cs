namespace Application.Handlers.Identity.Commands.Cookie
{
    using FluentValidation;

    public class CookieLoginComandValidator : AbstractValidator<CookieLoginComand>
    {
        public CookieLoginComandValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("A valid email address is required");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");
        }
    }
}