namespace Web.Controllers.Identity
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Shared;

    using Swashbuckle.AspNetCore.Annotations;

    using Application.Handlers.Identity.Commands.Password;

    using Web.Extensions;

    [Route("api/password")]
    public class PasswordController : ApiController
    {
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        [SwaggerOperation("Forgot Password", "Sends a password reset link to the user's email")]
        public async Task<ActionResult<Result<string>>> ForgotPassword(ForgotPasswordCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        [SwaggerOperation("Reset Password", "Resets user's password using a token")]
        public async Task<ActionResult<Result<string>>> ResetPassword(ResetPasswordCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [Authorize]
        [HttpPost("change-password")]
        [SwaggerOperation("Change Password", "Changes the authenticated user's password")]
        public async Task<ActionResult<Result<string>>> ChangePassword(ChangePasswordCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
    }
}