using AutoMapper;
using backend.Data;
using backend.Models;
using backend.src.DTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace backend.src.Service
{
    public class UserService(AppDbContext context, Functions functions, IMapper mapper) : IUserService
    {
        
        // DI
        private readonly AppDbContext _context = context;
        private readonly Functions _functions = functions;
        private readonly IMapper _mapper = mapper;

        public async Task<User> CreateUserAsync(User user)
        {
            if (string.IsNullOrEmpty(user.Password) ||user.Password.Length < 6)
            {
                throw new ArgumentNullException("Password must be at least 6 characters long");
            }
            try
            {
                user.Password = _functions.EncryptPassword(user.Password);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
            
            _context.Users.Add(user);  
            await _context.SaveChangesAsync();
            return user;  
        }

        public async Task<UserResponse> GetUserByIdAsync(int id)
        {
            User user = await _context.Users.FindAsync(id) ?? throw new ArgumentException("User not found");

            return _mapper.Map<UserResponse>(user);
        }
    }
}