namespace Application.Handlers.SMTP.Commands
{
    using FluentValidation;

    public class SendBaseEmailValidator : AbstractValidator<SendBaseEmailCommand>
    {
        public SendBaseEmailValidator() 
        {
            RuleFor(u => u.EmailProvider)
                .NotEmpty()
                .WithMessage("Email Provider is required.");

            RuleFor(u => u.Body)
                .NotNull()
                .WithMessage("Body is required.")
                .NotEmpty()
                .WithMessage("Body is required.");

            RuleFor(u => u.To)
                .NotNull()
                .WithMessage("Recipient list cannot be null.")
                .NotEmpty()
                .WithMessage("Recipient list cannot be empty.");

            RuleFor(u => u.Subject)
                .NotNull()
                .WithMessage("Subject cannot be null.")
                .NotEmpty()
                .WithMessage("Subject be empty.");
        }
    }
}