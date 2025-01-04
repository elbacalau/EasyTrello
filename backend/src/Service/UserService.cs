using backend.Data;
using backend.Models;
using backend.src.Interfaces;

namespace backend.src.Service
{
    public class UserService(AppDbContext context) : IUserService
    {
        
        // DI
        private readonly AppDbContext _context = context;

        public async Task<User> CreateUserAsync(User user)
        {
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