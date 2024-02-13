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
        //[HttpPost(nameof(BaseEmail1))]
        //[SwaggerOperation("Sends email with custom html body.", "")]
        //public async Task<IActionResult> BaseEmail1(SendBaseEmailCommand reques)
        //{
        //    return await Mediator.Send(reques).ToActionResult();
        //}

        //[HttpPost(nameof(TemplateEmail1))]
        //[SwaggerOperation("Sends email with specified local template.", "")]
        //public async Task<IActionResult> TemplateEmail1(SendTemplateEmailCommand reques)
        //{
        //    return await Mediator.Send(reques).ToActionResult();
        //}

        [HttpPost(nameof(BaseEmail))]
        [SwaggerOperation("Sends email with custom html body.")]
        public IActionResult BaseEmail(SendBaseEmailCommand request)
        {
            BackgroundJob.Enqueue<MediatorHangfireBridge>(x => x.Send(request));

            return Accepted("Email send request queued.");
        }

        [HttpPost(nameof(TemplateEmail))]
        [SwaggerOperation("Sends email with specified local template.")]
        public async Task<IActionResult> TemplateEmail([FromForm] SendTemplateEmailCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}