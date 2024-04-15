namespace Web.Controllers.Notification
{
    using Microsoft.AspNetCore.Mvc;

    using Swashbuckle.AspNetCore.Annotations;

    using Application.Handlers.Notification.Commands;

    using Web.Extentions;

    public class NotificationController : ApiController
    {
        [HttpPost]
        [SwaggerOperation("Send Notification.", "")]
        public async Task<ActionResult> Send([FromBody] SendNotificationCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }
    }
}