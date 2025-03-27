namespace Web.Controllers.Account
{
    using Microsoft.AspNetCore.Mvc;

    using Models.Account;

    using Shared;

    using Application.Handlers.Account.Queries;

    using Web.Extensions;

    [Route("api/user-activity")]
    public class UserActivityController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<Result<List<UserActivityModel>>>> GetActivities([FromQuery] int take = 20)
        {
            return await Mediator.Send(new GetUserActivitiesQuery(take)).ToActionResult();
        }
    }
}
