using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SMS.Application.Exceptions;
using System.Net;

namespace SMS.Api.Filters
{
    public class ApiExceptionFilterAttribute : ExceptionFilterAttribute
    {
        private readonly ILogger<ApiExceptionFilterAttribute> logger;

        public ApiExceptionFilterAttribute(ILogger<ApiExceptionFilterAttribute> logger)
        {
            this.logger = logger;
        }
        public override void OnException(ExceptionContext context)
        {
            HandleException(context);

            base.OnException(context);
        }

        private void HandleException(ExceptionContext context)
        {
            switch (context.Exception)
            {
                case ValidationException:
                    HandleValidationException(context);
                    break;
                case NotFoundException:
                    HandleNotFoundException(context);
                    break;
                case UnauthorizedAccessException:
                    HandleUnauthorizedAccessException(context);
                    break;
                case ForbiddenAccessException:
                    HandleForbiddenAccessException(context);
                    break;
                default:
                    HandleUnkownException(context);
                    break;
            }
        }

        private void HandleUnkownException(ExceptionContext context)
        {
            if (!context.ModelState.IsValid)
            {
                HandleInvalidModelStateException(context);
                return;
            }

            var status = (int)HttpStatusCode.InternalServerError;
            var url = context.HttpContext.Request.GetDisplayUrl();
            var problemDetails = new ProblemDetails
            {
                Title = "INTERNAL_SERVER_ERROR",
                Instance = url,
                Status = status,
                Detail = context.Exception.Message
            };

            context.Result = new ObjectResult(problemDetails);
            logger.LogError(new EventId(0), context.Exception, "Error occurred while processing {url}. Status Code: {status}", url, status);
        }

        private void HandleValidationException(ExceptionContext context)
        {
            var exception = (ValidationException)context.Exception;

            var details = new ValidationProblemDetails(exception.Errors)
            {
                Title = "VALIDATION_ERROR"
            };


            context.Result = new BadRequestObjectResult(details);

            context.ExceptionHandled = true;
        }

        private void HandleInvalidModelStateException(ExceptionContext context)
        {
            var details = new ValidationProblemDetails(context.ModelState)
            {
                Title = "VALIDATION_ERROR"
            };


            context.Result = new BadRequestObjectResult(details);

            context.ExceptionHandled = true;
        }

        private void HandleNotFoundException(ExceptionContext context)
        {
            var exception = (NotFoundException)context.Exception;

            var details = new ProblemDetails()
            {
                Title = "NOTFOUND",
                Detail = exception.Message
            };

            context.Result = new NotFoundObjectResult(details);

            context.ExceptionHandled = true;
        }

        private void HandleUnauthorizedAccessException(ExceptionContext context)
        {
            var details = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "UNAUTHORIZED",
            };

            context.Result = new ObjectResult(details)
            {
                StatusCode = StatusCodes.Status401Unauthorized
            };

            context.ExceptionHandled = true;
        }

        private void HandleForbiddenAccessException(ExceptionContext context)
        {
            var details = new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "FORBIDDEN"

            };

            context.Result = new ObjectResult(details)
            {
                StatusCode = StatusCodes.Status403Forbidden
            };

            context.ExceptionHandled = true;
        }
    }
}
