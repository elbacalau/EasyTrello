using System.Net;
using backend.src.Infrastructure.Helpers;
using backend.src.Models;

namespace backend.src.Middelware
{
    public class ExceptionHandlingMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async System.Threading.Tasks.Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                // unauthorized access handling
                await HandleExceptionAsync(context, ex, HttpStatusCode.Unauthorized, ErrorMessages.Unauthorized);
            }
            catch (ArgumentException ex)
            {
                // invalid data handling
                await HandleExceptionAsync(context, ex, HttpStatusCode.BadRequest, ErrorMessages.InvalidData);
            }
            catch (Exception ex)
            {
                // generic error handling
                await HandleExceptionAsync(context, ex, HttpStatusCode.InternalServerError, ErrorMessages.ServerError);
            }
        }

        private static async System.Threading.Tasks.Task HandleExceptionAsync(HttpContext context, Exception ex, HttpStatusCode statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var response = new ApiResponse<ErrorResponse>
            {
                Result = "error",
                Detail = new ErrorResponse
                {
                    Message = $"{message}: {ex.Message}",
                    Code = ((int)statusCode).ToString()
                }
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
