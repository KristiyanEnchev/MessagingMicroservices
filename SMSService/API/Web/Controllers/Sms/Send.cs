namespace Web.Controllers.Sms
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Web.Extentions;
    using Application.Handlers.Twilio.Commands;

    public class Send : ApiController
    {
        [HttpPost(nameof(CustomSMS))]
        [SwaggerOperation("Sends sms with custom text message.")]
        public async Task<IActionResult> CustomSMS(SendBaseSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpPost(nameof(TemplateSMS))]
        [SwaggerOperation("Sends sms with specified local template.")]
        public async Task<IActionResult> TemplateSMS([FromBody] SendTemplateSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}