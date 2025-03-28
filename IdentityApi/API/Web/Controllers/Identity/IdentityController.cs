namespace Web.Controllers.Identity
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Swashbuckle.AspNetCore.Annotations;

    using Shared;

    using Web.Extensions;

    using Application.Handlers.Identity.Commands.User;
    using Application.Handlers.Identity.Commands.Login;
    using Application.Handlers.Identity.Commands.Logout;
    using Application.Handlers.Identity.Commands.Refresh;
    using Application.Handlers.Identity.Commands.Register;

    using Models.Identity;

    public class IdentityController : ApiController
    {
        [AllowAnonymous]
        [HttpPost("register")]
        [SwaggerOperation("Register a user", "Creates a new user account and sends a verification email")]
        public async Task<ActionResult<string>> Register(UserRegisterCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [SwaggerOperation("Login with credentials", "Authenticates a user with email and password")]
        public async Task<ActionResult<Result<UserResponseModel>>> Login(UserLoginCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
        
        [AllowAnonymous]
        [HttpPost("refresh")]
        [SwaggerOperation("Refresh an access token", "Gets a new access token using a refresh token")]
        public async Task<ActionResult<Result<UserResponseModel>>> Refresh(UserRefreshCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [Authorize]
        [HttpPost("logout")]
        [SwaggerOperation("Logout", "Invalidates the user's tokens")]
        public async Task<ActionResult<Result<string>>> Logout(UserLogoutCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("unlock")]
        [SwaggerOperation("Unlock User Account", "Unlocks a user account that has been locked out due to failed login attempts")]
        public async Task<ActionResult<Result<string>>> UnlockAccount(UnlockUserAccountCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
    }
}