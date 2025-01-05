using backend.Models;
using backend.src.DTOs;

namespace backend.src.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(User user);
        Task<UserResponse> GetUserByIdAsync(int id);
    }
}