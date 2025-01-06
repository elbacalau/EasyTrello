using Microsoft.AspNetCore.Mvc.Filters;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Models;

namespace backend.src.Middleware
{
    public class RoleValidationAttribute(AppDbContext dbContext) : ActionFilterAttribute
    {
        private readonly AppDbContext _dbContext = dbContext;

        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var userId = int.Parse(context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("Error del filtro"));

            var boardId = int.Parse(context.ActionArguments["boardId"]?.ToString()
                ?? throw new ArgumentException("Board ID no encontrado en la URL"));

            var boardUser = await _dbContext.BoardUsers
                .FirstOrDefaultAsync(bu => bu.BoardId == boardId && bu.UserId == userId);

            if (boardUser == null || (boardUser.Role != BoardRole.Owner && boardUser.Role != BoardRole.Admin))
                throw new UnauthorizedAccessException("No tienes permisos para realizar esta acción.");
            

            await next();
        }
    }
}
