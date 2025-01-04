using backend.Data;
using backend.Models;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController(AppDbContext context, UserService userService) : ControllerBase
    {

        private readonly AppDbContext _context = context;
        private readonly UserService _userService = userService;

        // endpoint para crear el usuario
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {

            if (user == null)
            {
                return BadRequest(new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = "User data is required",
                        Code = "400"
                    }
                });
            }

            var newUser = await _userService.CreateUserAsync(user);
            return Ok(new ApiResponse<User>
            {
                Result = "success",
                Detail = newUser
            });
        }


        // endpoint para obtener un usuario por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = "User not found",
                        Code = "404"
                    }
                });
            }

            return Ok(new ApiResponse<User>
            {
                Result = "success",
                Detail = user
            });
        }


    }
}