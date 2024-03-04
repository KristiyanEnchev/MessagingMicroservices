namespace Web.Controllers.Sms
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Web.Extentions;

    using Application.Handlers.Twilio.Commands;

    public class Send : ApiController
    {
        [HttpPost(nameof(Custom))]
        [SwaggerOperation("Sends sms with custom text message.")]
        public async Task<IActionResult> Custom(SendBaseSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpPost(nameof(Template))]
        [SwaggerOperation("Sends sms with specified local template.")]
        public async Task<IActionResult> Template([FromBody] SendTemplateSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}