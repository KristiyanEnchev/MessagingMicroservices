namespace Web.Controllers.Email
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Hangfire;

    using Web.Extentions;
    using Web.Extentions.MediatoR;

    using Application.Handlers.SMTP.Commands;

    public class Send : ApiController
    {
        [HttpPost(nameof(Custom))]
        [SwaggerOperation("Sends email with custom html body.")]
        public IActionResult Custom(SendBaseEmailCommand request)
        {
            BackgroundJob.Enqueue<MediatorHangfireBridge>(x => x.Send(request));

            return Accepted("Email send request queued.");
        }

        [HttpPost(nameof(Template))]
        [SwaggerOperation("Sends email with specified local template.")]
        public async Task<IActionResult> Template([FromBody] SendTemplateEmailCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}