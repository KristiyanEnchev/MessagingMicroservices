namespace Web.Controllers.Sms
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    public class Send : ApiController
    {
        [HttpPost(nameof(CustomSMS))]
        [SwaggerOperation("Sends email with custom html body.")]
        public async Task<IActionResult> CustomSMS(SendBaseSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();

            return Accepted("Email send request queued.");
        }

        [HttpPost(nameof(TemplateSMS))]
        [SwaggerOperation("Sends email with specified local template.")]
        public async Task<IActionResult> TemplateSMS([FromBody] SendTemplateSMSCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}