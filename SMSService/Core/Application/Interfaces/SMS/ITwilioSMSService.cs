namespace Application.Interfaces.SMS
{
    using Models.SMS;

    using Shared;

    public interface ITwilioSMSService
    {
        Task<Result<string>> SendCustomSMS(CustomSmsMessage model);
        Task<Result<string>> SendSMSWithLocalTemplate(TemplateSmsMessage model);
    }
}