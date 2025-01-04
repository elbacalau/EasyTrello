using backend.src.DTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AuthService authService) : ControllerBase
    {
        private readonly AuthService _authService = authService;
    
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request.Email, request.Password);
            return Ok(new ApiResponse<string>
            {
                Result = "success",
                Detail = token
            });
        }



        // endpoint for registering a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            RegisterRequest newUser = await _authService.RegisterAsync(request);
            return Ok(new ApiResponse<RegisterRequest>
            {
                Result = "success",
                Detail = newUser
            });
        }
    }
}
