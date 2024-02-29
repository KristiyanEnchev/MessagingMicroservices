namespace Application.Handlers.SMTP.Commands
{
    using FluentValidation;

    public class SendTemplateSMSValidator : AbstractValidator<SendTemplateSMSCommand>
    {
        public SendTemplateSMSValidator() 
        {
            RuleFor(u => u.SmsProvider)
                .NotEmpty()
                .WithMessage("Sms Provider is required.");

            RuleFor(u => u.TemplateName)
                .NotEmpty()
                .WithMessage("TemplateName is required.");

            RuleFor(u => u.To)
                .NotNull()
                .WithMessage("Recipient cannot be null.")
                .NotEmpty()
                .WithMessage("Recipient cannot be empty.");
        }
    }
}