namespace Infrastructure.Twilio
{
    using Microsoft.Extensions.Options;

    using global::Twilio;
    using global::Twilio.Types;
    using global::Twilio.Rest.Api.V2010.Account;

    using AutoMapper;

    using Application.Interfaces.SMS;

    using Models.SMS;

    using Shared;

    public class TwilioSMSService
    {
        private readonly ITemplateService _templateService;
        private readonly IOptions<TwilioSettings> _mailingSettings;
        private readonly IMapper _mapper;

        public TwilioSMSService(ITemplateService templateService, IOptions<TwilioSettings> mailingSettings, IMapper mapper)
        {
            _templateService = templateService;
            _mailingSettings = mailingSettings;
            _mapper = mapper;
        }

        public async Task<Result<string>> SendCustomSMS(CustomSmsMessage model)
        {
            var mappedRequest = _mapper.Map<SmsMessage>(model);

            if (model.TemplateData != null)
            {
                mappedRequest.Body = await _templateService.ProcessSMSTemplate(model.Message!, model.TemplateData!);
            }

            return await SendAsync(mappedRequest);
        }

        public async Task<Result<string>> SendSMSWithLocalTemplate(TemplateSmsMessage model)
        {
            var mappedRequest = _mapper.Map<SmsMessage>(model);

            mappedRequest.Body = await _templateService.GenerateSMSTemplate(model.TemplateName!, model.TemplateData!);

            return await SendAsync(mappedRequest);
        }

        public async Task<Result<string>> SendAsync(SmsMessage request)
        {
            if (request.Body == null)
            {
                return Result<string>.Failure("Sms Body is required");
            }

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