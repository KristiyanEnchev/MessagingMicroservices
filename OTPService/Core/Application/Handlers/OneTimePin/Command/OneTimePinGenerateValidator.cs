namespace Application.Handlers.OneTimePin.Command
{
    using FluentValidation;

    public class OneTimePinGenerateValidator : AbstractValidator<OneTimePinGenerateCommand>
    {
        public OneTimePinGenerateValidator()
        {
            RuleFor(u => u.Identifier)
                .NotNull()
                .WithMessage("Identifier is required.")
                .NotEmpty()
                .WithMessage("Identifier is required.");

            RuleFor(u => u.ExpirationMinutes)
                .NotNull()
                .WithMessage("ExpirationMinutes is required.")
                .NotEmpty()
                .WithMessage("ExpirationMinutes is required.");
        }
    }
}
