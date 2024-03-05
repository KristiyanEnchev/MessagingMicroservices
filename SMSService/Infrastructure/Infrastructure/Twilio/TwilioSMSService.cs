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

    public class TwilioSMSService : ITwilioSMSService
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
                mappedRequest.Message = await _templateService.ProcessSMSTemplate(model.Message!, model.TemplateData!);
            }

            return await SendAsync(mappedRequest);
        }

        public async Task<Result<string>> SendSMSWithLocalTemplate(TemplateSmsMessage model)
        {
            var mappedRequest = _mapper.Map<SmsMessage>(model);

            mappedRequest.Message = await _templateService.GenerateSMSTemplate(model.TemplateName!, model.TemplateData!);

            return await SendAsync(mappedRequest);
        }

        public async Task<Result<string>> SendAsync(SmsMessage request)
        {
            if (request.Message == null)
            {
                return Result<string>.Failure("Sms Body is required");
            }

            string accountSid = _mailingSettings.Value.AccountSid!;
            string authToken = _mailingSettings.Value.AuthToken!;
            var from = new PhoneNumber("(205)831-4602");

            TwilioClient.Init(accountSid, authToken);

            var message = MessageResource.Create(
                from: from,
                to: new PhoneNumber(request.To),
                body: request.Message
            );

            return Result<string>.SuccessResult($"Sms Sent: {message.Sid}.");
        }
    }
}