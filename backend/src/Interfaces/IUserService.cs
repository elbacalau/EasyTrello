using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.UserDTOs;

namespace backend.src.Interfaces
{
    public interface IUserService
    {
        Task<User> CreateUserAsync(User user);
        Task<UserResponse> GetUserByIdAsync(int id);
        Task<UserDataResponse> GetUserData();
    }
}