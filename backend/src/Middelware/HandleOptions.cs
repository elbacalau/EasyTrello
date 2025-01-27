using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

public class HandleOptionsMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Method == HttpMethods.Options)
        {
            context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173");
            context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization");
            context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
            context.Response.StatusCode = StatusCodes.Status204NoContent;
            await context.Response.CompleteAsync();
        }
        else
        {
            await _next(context);
        }
    }
}
public static class HandleOptionsMiddlewareExtensions
{
    public static IApplicationBuilder UseHandleOptionsMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<HandleOptionsMiddleware>();
    }
}
