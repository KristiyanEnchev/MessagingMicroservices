namespace Application.Handlers.Twilio.Commands
{
    using FluentValidation;

    public class SendBaseSMSValidator : AbstractValidator<SendBaseSMSCommand>
    {
        public SendBaseSMSValidator()
        {
            RuleFor(u => u.SmsProvider)
                .NotEmpty()
                .WithMessage("Sms Provider is required.");

            RuleFor(u => u.Message)
                .NotNull()
                .WithMessage("Message is required.")
                .NotEmpty()
                .WithMessage("Message is required.");

            RuleFor(u => u.To)
                .NotNull()
                .WithMessage("Recipient cannot be null.")
                .NotEmpty()
                .WithMessage("Recipient cannot be empty.");
        }
    }
}