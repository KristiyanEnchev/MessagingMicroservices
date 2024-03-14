namespace Web.Controllers.OTP
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Application.Handlers.OneTimePin.Command;

    using Web.Extentions;

    public class OTPController : ApiController
    {
        [HttpPost(nameof(Generate))]
        [SwaggerOperation("Generate One Time Pin.", "Uses Cryptography to generate One Time Pin and store's it in cache for validation.")]
        public async Task<IActionResult> Generate(OneTimePinGenerateCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}