namespace Web.Controllers.Identity
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

    using Swashbuckle.AspNetCore.Annotations;

    using Application.Handlers.Identity.Queries;
    using Application.Handlers.Identity.Commands.Role;

    using Shared;

    using Web.Extensions;

    using Models.Role;

    using Persistence.Constants;

    [Route("api/roles")]
    [Authorize(Roles = Roles.Administrator)]
    public class RoleController : ApiController
    {
        [HttpGet]
        [SwaggerOperation("Get All Roles", "Retrieves all available roles")]
        public async Task<ActionResult<Result<List<string>>>> GetRoles()
        {
            return await Mediator.Send(new GetRolesQuery()).ToActionResult();
        }

        [HttpPost]
        [SwaggerOperation("Create Role", "Creates a new role")]
        public async Task<ActionResult<Result<RoleResult>>> CreateRole(CreateRoleCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpDelete("{roleName}")]
        [SwaggerOperation("Delete Role", "Deletes an existing role")]
        public async Task<ActionResult<Result<string>>> DeleteRole(string roleName)
        {
            return await Mediator.Send(new DeleteRoleCommand { RoleName = roleName }).ToActionResult();
        }

        [HttpPost("add-user")]
        [SwaggerOperation("Add User to Role", "Adds a user to a specified role")]
        public async Task<ActionResult<Result<string>>> AddUserToRole(AddUserToRoleCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpPost("remove-user")]
        [SwaggerOperation("Remove User from Role", "Removes a user from a specified role")]
        public async Task<ActionResult<Result<string>>> RemoveUserFromRole(RemoveUserFromRoleCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpGet("{userId}")]
        [SwaggerOperation("Get User Roles", "Retrieves all roles assigned to a user")]
        public async Task<ActionResult<Result<List<string>>>> GetUserRoles(string userId)
        {
            return await Mediator.Send(new GetUserRolesQuery { UserId = userId }).ToActionResult();
        }

        [HttpGet("{roleName}/users")]
        [SwaggerOperation("Get Users in Role", "Retrieves all users assigned to a role")]
        public async Task<ActionResult<Result<List<UserInRoleDto>>>> GetUsersInRole(
            string roleName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            return await Mediator.Send(new GetUsersInRoleQuery
            {
                RoleName = roleName,
                PageNumber = pageNumber,
                PageSize = pageSize
            }).ToActionResult();
        }
    }
}