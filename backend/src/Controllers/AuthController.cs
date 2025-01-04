using backend.src.DTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Sprache;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AuthService authService) : ControllerBase
    {

        private readonly AuthService _authService = authService;
        
        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest(new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = ErrorMessages.InvalidData,
                        Code = ErrorCodes.BadRequest
                    }
                });
            }

            try
            {
                var token = await _authService.LoginAsync(request.Email, request.Password);

                if (string.IsNullOrEmpty(token))
                {
                    return Unauthorized(new ApiResponse<ErrorResponse>
                    {
                        Result = "error",
                        Detail = new ErrorResponse
                        {
                            Message = ErrorMessages.InvalidEmailOrPassword,
                            Code = ErrorCodes.Unauthorized
                        }
                    });
                }

                return Ok(new ApiResponse<string>
                {
                    Result = "success",
                    Detail = token
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = $"{ErrorMessages.InternalServerError}: {ex.Message}",
                        Code = ErrorCodes.InternalServerError
                    }
                });
            }
        }
        
    }
}