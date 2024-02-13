namespace Application.Handlers.SMTP.Commands
{
    using FluentValidation;

    public class SendTemplateEmailValidator : AbstractValidator<SendTemplateEmailCommand>
    {
        public SendTemplateEmailValidator() 
        {
            RuleFor(u => u.EmailProvider)
                .NotEmpty()
                .WithMessage("Email Provider is required.");

            RuleFor(u => u.TemplateKey)
                .NotEmpty()
                .WithMessage("TemplateKey is required.");

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

            //RuleFor(u => u.TemplateData)
            //    .NotEmpty().WithMessage("TemplateData cannot be empty.")
            //    .Must(data => data != null && data.Any()).WithMessage("TemplateData must contain at least one item.");
        }
    }
}