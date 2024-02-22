namespace Infrastructure.Twilio
{
    using Microsoft.Extensions.Options;

    using global::Twilio;
    using global::Twilio.Types;
    using global::Twilio.Rest.Api.V2010.Account;

    using Application.Interfaces.SMS;

    using Models.SMS;

    using Shared;

    public class TwilioSMSService
    {
        private readonly ITemplateService _templateService;
        private readonly IOptions<TwilioSettings> _mailingSettings;

        public TwilioSMSService(ITemplateService templateService, IOptions<TwilioSettings> mailingSettings)
        {
            _templateService = templateService;
            _mailingSettings = mailingSettings;
        }

        public async Task<Result<string>> SendAsync(SmsMessage request)
        {
            string accountSid = _mailingSettings.Value.AccountSid!;
            string authToken = _mailingSettings.Value.AuthToken!;

            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                from: new PhoneNumber(request.From),
                to: new PhoneNumber(request.To),
                body: request.Body
            );

            return Result<string>.SuccessResult("Sms Sent.");
        }
    }
}