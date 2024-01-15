namespace Web.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    [ApiController]
    [Route("api/[controller]")]
    public abstract class ApiController : ControllerBase
    {
        protected const string Id = "{id}";
        protected const string PathSeparator = "/";

        private ISender _mediator = null!;
        protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();
    }
}