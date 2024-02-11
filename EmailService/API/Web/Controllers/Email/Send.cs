namespace Web.Controllers.Email
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Models.Mailing;

    using Web.Extentions;
    using Application.Handlers.SMTP.Commands;

    public class Send : ApiController
    {
        [HttpPost(nameof(BaseEmail))]
        [SwaggerOperation("Sends email with custom html body.", "")]
        public async Task<IActionResult> BaseEmail(SendBaseEmailCommand reques)
        {
            return await Mediator.Send(reques).ToActionResult();
        }

        [HttpPost(nameof(TemplateEmail))]
        [SwaggerOperation("Sends email with specified local template.", "")]
        public async Task<IActionResult> TemplateEmail(SendBaseEmailCommand reques)
        {
            return await Mediator.Send(reques).ToActionResult();
        }
    }
}
