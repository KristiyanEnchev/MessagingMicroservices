namespace Web.Extensions
{
    using System.Threading.Tasks;

    using Microsoft.AspNetCore.Mvc;

    using Shared;
    using Shared.Interfaces;

    public static class ResultExtensions
    {
        public static async Task<ActionResult> ToActionResult<TData>(this Task<Result<TData>> resultTask)
        {
            var result = await resultTask;

            if (!result.Success)
            {
                if (result.Errors != null && result.Errors.Any())
                {
                    return new BadRequestObjectResult(new { errors = result.Errors });
                }
                return new BadRequestObjectResult("Unexpected Error occurred");
            }

            if (result.Data == null)
            {
                return new NoContentResult();
            }

            if (result.Data is PaginatedResult<object> paginatedResult)
            {
                return new OkObjectResult(paginatedResult);
            }

            if (result.Data is string)
            {
                return new OkObjectResult(new { message = result.Data });
            }

            return new OkObjectResult(result.Data);
        }
    }
}