using System.Security.Claims;
using backend.src.Models;
using backend.src.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.src.Middleware
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class RequirePermissionAttribute : TypeFilterAttribute
    {
        public RequirePermissionAttribute(PermissionType permission) : base(typeof(PermissionActionFilter))
        {
            Arguments = [permission];
        }
    }

    public class PermissionActionFilter : IAsyncActionFilter
    {
        private readonly PermissionType _requiredPermission;
        private readonly PermissionService _permissionService;

        public PermissionActionFilter(PermissionType requiredPermission, PermissionService permissionService)
        {
            _requiredPermission = requiredPermission;
            _permissionService = permissionService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (!context.RouteData.Values.TryGetValue("boardId", out var boardIdObj) || 
                !int.TryParse(boardIdObj?.ToString(), out var boardId))
            {
                context.Result = new BadRequestObjectResult("BoardId no especificado o inválido");
                return;
            }

            var userId = int.Parse(context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier) 
                ?? throw new UnauthorizedAccessException("Usuario no autenticado"));

            var hasPermission = await _permissionService.UserHasPermissionAsync(userId, boardId, _requiredPermission);

            if (!hasPermission)
            {
                context.Result = new ForbidResult();
                return;
            }

            await next();
        }
    }
} 