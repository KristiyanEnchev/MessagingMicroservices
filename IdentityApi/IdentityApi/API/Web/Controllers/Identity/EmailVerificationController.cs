namespace Web.Controllers.Identity
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Swashbuckle.AspNetCore.Annotations;

    using Shared;

    using Web.Extensions;

    using Application.Handlers.Identity.Commands.User;

    [Route("api/email")]
    public class EmailVerificationController : ApiController
    {
        [AllowAnonymous]
        [HttpGet("confirm")]
        public async Task<ActionResult<Result<string>>> ConfirmEmail(
            [FromQuery] string email,
            [FromQuery] string token,
            [FromQuery] string otp)
        {
            var command = new ConfirmEmailCommand(email, token, otp);
            return await Mediator.Send(command).ToActionResult();
        }

        [AllowAnonymous]
        [HttpPost("resend")]
        [SwaggerOperation("Resend Verification Email", "Sends a new verification email to the user")]
        public async Task<ActionResult<Result<string>>> ResendVerificationEmail(SendVerificationEmailCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
    }
}