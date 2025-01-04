using backend.Data;
using backend.Models;
using backend.src.Infrastructure.Helpers;
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
                        Message = ErrorMessages.InvalidData,
                        Code = "400"
                    }
                });
            }

            try
            {
                var newUser = await _userService.CreateUserAsync(user);

                return Ok(
                  new ApiResponse<User>
                  {
                      Result = "success",
                      Detail = newUser
                  }
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = $"{ErrorMessages.InvalidData}: {ex.Message}",
                        Code = "400"
                    }
                });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = $"{ErrorMessages.ServerError}: {ex.Message}",
                        Code = "500"
                    }
                });
            }
        }

        // endpoint para obtener un usuario por id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);

                if (user == null)
                {
                    return NotFound(new ApiResponse<ErrorResponse>
                    {
                        Result = "error",
                        Detail = new ErrorResponse
                        {
                            Message = ErrorMessages.NotFound,
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
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = $"{ErrorMessages.InvalidData}: {ex.Message}",
                        Code = "400"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<ErrorResponse>
                {
                    Result = "error",
                    Detail = new ErrorResponse
                    {
                        Message = $"{ErrorMessages.ServerError}: {ex.Message}",
                        Code = "500"
                    }
                });
            }
        }


    }
}