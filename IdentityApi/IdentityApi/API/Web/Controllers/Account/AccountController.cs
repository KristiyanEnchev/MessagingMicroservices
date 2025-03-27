namespace Web.Controllers.Account
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Swashbuckle.AspNetCore.Annotations;

    using Application.Handlers.Account.Queries;
    using Application.Handlers.Account.Comands;

    using Persistence.Constants;

    using Shared;

    using Models.Enums;
    using Models.Account;

    using Web.Extensions;

    [Authorize(Roles = Roles.Administrator)]
    public class AccountController : ApiController
    {
        [HttpGet(nameof(Users))]
        [SwaggerOperation("Get All Users.", "")]
        public async Task<IActionResult> Users()
        {
            return await Mediator.Send(new GetUsersQuery()).ToActionResult();
        }

        [HttpGet(nameof(PagedUsers))]
        [SwaggerOperation("Get All Users.", "")]
        public async Task<PaginatedResult<UserResponseGetModel>> PagedUsers(int pageNumber, int pageSize, SortBy sortBy, Sort order)
        {
            return await Mediator.Send(new GetUsersPagedQuery(pageNumber, pageSize, sortBy, order));
        }

        [HttpGet(nameof(UserBy))]
        [SwaggerOperation("Get User By.", "")]
        public async Task<IActionResult> UserBy(FindBy findBy, string value)
        {
            return await Mediator.Send(new GetUserQuery(findBy, value)).ToActionResult();
        }

        [HttpPost(nameof(ToggleStatus))]
        [SwaggerOperation("Toggle user status.", "")]
        public async Task<IActionResult> ToggleStatus(string identifier, [FromQuery] ToggleUserValue toggleValiue)
        {
            return await Mediator.Send(new ToggleStatusCommand(identifier, toggleValiue)).ToActionResult();
        }

        [HttpPut(nameof(Update))]
        [SwaggerOperation("Update user data.", "")]
        public async Task<IActionResult> Update(UpdateUserCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }

        [HttpDelete(nameof(Update))]
        [SwaggerOperation("Delete user.", "")]
        public async Task<IActionResult> Delete(DeleteUserCommand request)
        {
            return await Mediator.Send(request).ToActionResult();
        }
    }
}