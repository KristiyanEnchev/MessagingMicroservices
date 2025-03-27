namespace Web.Extensions.Middleware
{
    using System;
    using System.Net;
    using System.Text.Json;
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Microsoft.AspNetCore.Http;

    using Serilog;
    using Serilog.Context;

    using Web.Extensions.Json;

    using Shared.Exceptions;

    using Application.Interfaces;
    using Shared;

    public class ErrorHandlerMiddleware : IMiddleware
    {
        private readonly IUser _currentUser;

        public ErrorHandlerMiddleware(IUser currentUser)
        {
            _currentUser = currentUser;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception exception)
            {
                await HandleExceptionAsync(context, exception);
            }
        }

        protected async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            ErrorResult errorResult = CreateErrorResult(exception);

            LogException(context, exception, errorResult);

            await SendErrorResponseAsync(context, errorResult);
        }

        protected virtual ErrorResult CreateErrorResult(Exception exception)
        {
            string errorId = Guid.NewGuid().ToString();

            var errorResult = new ErrorResult
            {
                Source = exception.TargetSite?.DeclaringType?.FullName,
                Exception = exception.Message.Trim(),
                ErrorId = errorId,
                SupportMessage = $"Provide the ErrorId {errorId} to the support team for further analysis."
            };

            if (exception is not CustomException && exception.InnerException != null)
            {
                while (exception.InnerException != null)
                {
                    exception = exception.InnerException;
                }
            }

            if (exception is FluentValidation.ValidationException fluentException)
            {
                errorResult.Exception = "One or More Validations failed.";
                foreach (var error in fluentException.Errors)
                {
                    errorResult.Messages.Add(error.ErrorMessage);
                }
            }

            switch (exception)
            {
                case FluentValidation.ValidationException validationException:
                    errorResult.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResult.Messages.AddRange(validationException.Errors.Select(e => e.ErrorMessage));
                    break;

                case CustomException e:
                    errorResult.StatusCode = (int)e.StatusCode;
                    if (e.ErrorMessages is not null)
                    {
                        errorResult.Messages = e.ErrorMessages;
                    }
                    else
                    {
                        errorResult.Messages.Add(e.Message);
                    }
                    break;

                case KeyNotFoundException:
                    errorResult.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResult.Messages.Add("The requested resource was not found.");
                    break;

                case NotImplementedException:
                    errorResult.StatusCode = (int)HttpStatusCode.NotImplemented;
                    errorResult.Messages.Add("The requested operation is not implemented.");
                    break;

                case UnauthorizedAccessException:
                    errorResult.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResult.Messages.Add("Access is denied.");
                    break;

                default:
                    errorResult.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResult.Messages.Add("An unexpected error occurred.");

                    if (!IsProduction())
                    {
                        errorResult.Messages.Add(exception.Message);
                        if (exception.InnerException != null)
                        {
                            errorResult.Messages.Add(exception.InnerException.Message);
                        }
                    }
                    break;
            }

            return errorResult;
        }

        protected virtual void LogException(HttpContext context, Exception exception, ErrorResult errorResult)
        {
            string email = _currentUser.Email is string userEmail && !string.IsNullOrEmpty(userEmail)
                ? userEmail
                : "Anonymous";

            var userId = _currentUser.Id;

            if (!string.IsNullOrEmpty(userId))
                LogContext.PushProperty("UserId", userId);

            LogContext.PushProperty("UserEmail", email);
            LogContext.PushProperty("RequestPath", context.Request.Path);
            LogContext.PushProperty("ErrorId", errorResult.ErrorId);
            LogContext.PushProperty("StackTrace", exception.StackTrace);

            Log.Error(
                exception,
                "Error: {ErrorMessage}. Status Code: {StatusCode}. ErrorId: {ErrorId}. {AdditionalInfo}",
                exception.Message,
                errorResult.StatusCode,
                errorResult.ErrorId,
                string.Join(" ", errorResult.Messages)
            );
        }

        protected virtual async Task SendErrorResponseAsync(HttpContext context, ErrorResult errorResult)
        {
            var response = context.Response;
            if (response.HasStarted)
            {
                Log.Warning("Cannot write error response. Response has already started.");
                return;
            }

            response.ContentType = "application/json";
            response.StatusCode = errorResult.StatusCode;

            var jsonOptions = JsonSerializerOptionsExtensions.GetDefaultOptions();
            await response.WriteAsync(JsonSerializer.Serialize(errorResult, jsonOptions));
        }

        protected virtual bool IsProduction()
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            return environment?.ToLower() == "production";
        }
    }
}