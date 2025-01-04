using backend.Data;
using backend.Models;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace backend.src.Service
{
    public class UserService(AppDbContext context, Functions functions) : IUserService
    {
        
        // DI
        private readonly AppDbContext _context = context;
        private readonly Functions _functions = functions;

        public async Task<User> CreateUserAsync(User user)
        {
            
            try
            {
                user.Password = _functions.EncryptPassword(user.Password);
            }
            catch (Exception)
            {
                throw new Exception("Error while hashing password");
            }
            
            _context.Users.Add(user);  
            await _context.SaveChangesAsync();
            return user;  
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}