namespace Web.Controllers.Identity
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Swashbuckle.AspNetCore.Annotations;

    using Shared;

    using Web.Extensions;

    using Application.Handlers.Identity.Commands.User;
    using Application.Handlers.Identity.Commands.TwoFactor;

    using Models.Identity;

    public class TwoFactorAuthController : ApiController
    {
        [AllowAnonymous]
        [HttpPost("generate")]
        [SwaggerOperation("Generate a 2FA verification code", "Generates and sends a 2FA code via email or SMS")]
        public async Task<ActionResult<Result<TwoFactorCodeResult>>> Generate([FromBody] Generate2FACodeCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [AllowAnonymous]
        [HttpPost("verify")]
        [SwaggerOperation("Verify a 2FA code", "Verifies a 2FA code and returns authentication tokens")]
        public async Task<ActionResult<Result<UserResponseModel>>> Verify([FromBody] Verify2FACodeCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [HttpPost(nameof(Enable2fa))]
        [SwaggerOperation("Enable Two Factor Authentication", "")]
        public async Task<ActionResult<Result<string>>> Enable2fa(EnableTwoFactorAuthenticationCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [AllowAnonymous]
        [HttpPost(nameof(Disable2Fa))]
        [SwaggerOperation("Disable Two Factor Authentication", "")]
        public async Task<ActionResult<Result<string>>> Disable2Fa(DisableTwoFactorAuthenticationCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
    }
}