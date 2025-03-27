namespace Web.Controllers.Identity
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Application.Handlers.Identity.Commands.Cookie;

    using Shared;

    using Swashbuckle.AspNetCore.Annotations;

    using Web.Extensions;

    public class CookieController : ApiController
    {
        [AllowAnonymous]
        [HttpPost("login-with-cookie")]
        [SwaggerOperation("Login with Cookie", "Authenticates a user and sets an authentication cookie")]
        public async Task<ActionResult<Result<string>>> LoginWithCookie(CookieLoginComand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [HttpPost("logout-cookie")]
        [SwaggerOperation("Logout Cookie", "Invalidates the user's authentication cookie")]
        public async Task<ActionResult<Result<string>>> LogoutCookie()
        {
            return await Mediator.Send(new CookieLogoutComand(null)).ToActionResult();
        }
    }
}
