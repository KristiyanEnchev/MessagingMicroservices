namespace Web.Extentions.Middleware
{
    using System;
    using System.Net;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Builder;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    using Serilog;

    using Shared.Exceptions;

    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                await HandleExceptionAsync(context, error);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError;
            var messages = new List<string>();

            switch (exception)
            {
                case FluentValidation.ValidationException validationException:
                    statusCode = HttpStatusCode.BadRequest;
                    messages.AddRange(validationException.Errors.Select(e => e.ErrorMessage));
                    break;

                case CustomException customException:
                    statusCode = customException.StatusCode;
                    messages.AddRange(customException.ErrorMessages ?? new List<string> { customException.Message });
                    break;

                case KeyNotFoundException _:
                    statusCode = HttpStatusCode.NotFound;
                    break;

                case NotImplementedException _:
                    statusCode = HttpStatusCode.NotImplemented;
                    messages.Add("The requested operation is not implemented.");
                    break;

                case UnauthorizedAccessException _:
                    statusCode = HttpStatusCode.Unauthorized;
                    messages.Add("Access is denied.");
                    break;

                default:
                    messages.Add("An unexpected error occurred.");
                    messages.Add(exception.Message.ToString());
                    if (exception.InnerException != null)
                    {
                        messages.Add(exception.InnerException!.ToString());
                    }
                    break;
            }

            Log.Error($"Error: {exception.Message}. Status Code: {statusCode}. {string.Join(" ", messages)}");

            var response = context.Response;
            response.ContentType = "application/json";
            response.StatusCode = (int)statusCode;

            var errorResponse = new
            {
                success = false,
                data = (object)null,
                errors = messages
            };

            await response.WriteAsync(JsonConvert.SerializeObject(errorResponse, new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy(true, true)
                }
            }));
        }
    }

    public static class ErrorHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseErrorHandler(this IApplicationBuilder builder)
            => builder.UseMiddleware<ErrorHandlerMiddleware>();
    }
}
