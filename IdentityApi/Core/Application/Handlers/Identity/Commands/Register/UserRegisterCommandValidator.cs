namespace Application.Handlers.Identity.Commands.Register
{
    using FluentValidation;

    public class UserRegisterCommandValidator : AbstractValidator<UserRegisterCommand>
    {
        public const int MinEmailLength = 3;
        public const int MaxEmailLength = 50;
        public const int MinPasswordLength = 6;
        public const int MaxPasswordLength = 32;
        public const int MinNameLength = 2;
        public const int MaxNameLength = 120;

        public UserRegisterCommandValidator()
        {
            RuleFor(u => u.FirstName)
                .MinimumLength(MinNameLength)
                .WithMessage("The Firstname must be more than 2 charecters long.")
                .MaximumLength(MaxNameLength)
                .WithMessage("The Firstname must not be more than 120 charecters long.")
                .NotEmpty();

            RuleFor(u => u.LastName)
                .MinimumLength(MinNameLength)
                .WithMessage("The Lastname must be more than 2 charecters long.")
                .MaximumLength(MaxNameLength)
                .WithMessage("The Lastname must not be more than 120 charecters long.")
                .NotEmpty();

            RuleFor(u => u.Email)
                .MinimumLength(MinEmailLength)
                .WithMessage("The email must be more than 3 charecters long.")
                .MaximumLength(MaxEmailLength)
                .WithMessage("The email must not be more than 50 charecters long.")
                .EmailAddress()
                .WithMessage("The email must be a valid email address.")
                .NotEmpty();

            RuleFor(u => u.Password)
                .MinimumLength(MinPasswordLength)
                .WithMessage("The passwordshould be between 6 and 32 charecters long.")
                .MaximumLength(MaxPasswordLength)
                .WithMessage("The passwordshould be between 6 and 32 charecters long.")
                .NotEmpty();

            RuleFor(u => u.ConfirmPassword)
                .Equal(u => u.Password)
                .WithMessage("The password and confirmation password do not match.")
                .NotEmpty();
        }
    }
}