using backend.src.DTOs.PermissionDTOs;
using backend.src.Middleware;
using backend.src.Models;
using backend.src.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/permissions")]
    [Authorize]
    public class PermissionController(PermissionService permissionService) : ControllerBase
    {
        private readonly PermissionService _permissionService = permissionService;

        [HttpGet("board/{boardId}/user/{userId}")]
        [RequirePermission(PermissionType.ManagePermissions)]
        public async Task<IActionResult> GetUserPermissions(int boardId, int userId)
        {
            try
            {
                var permissions = await _permissionService.GetUserPermissionsAsync(userId, boardId);
                return Ok(new ApiResponse<UserPermissionResponse>
                {
                    Result = "success",
                    Detail = permissions
                });
            }
            catch (System.ArgumentException ex)
            {
                return NotFound(new ApiResponse<string>
                {
                    Result = "error",
                    Detail = ex.Message
                });
            }
        }

        [HttpGet("board/{boardId}/my")]
        public async Task<IActionResult> GetMyPermissions(int boardId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value 
                    ?? throw new System.UnauthorizedAccessException("Usuario no autenticado"));
                
                var permissions = await _permissionService.GetUserPermissionsAsync(userId, boardId);
                return Ok(new ApiResponse<UserPermissionResponse>
                {
                    Result = "success",
                    Detail = permissions
                });
            }
            catch (System.ArgumentException ex)
            {
                return NotFound(new ApiResponse<string>
                {
                    Result = "error",
                    Detail = ex.Message
                });
            }
            catch (System.UnauthorizedAccessException ex)
            {
                return Unauthorized(new ApiResponse<string>
                {
                    Result = "error",
                    Detail = ex.Message
                });
            }
        }
    }
} 