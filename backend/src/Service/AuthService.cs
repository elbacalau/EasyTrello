using backend.Data;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Service
{
    public class AuthService(AppDbContext context) : IAuthService
    {
        private readonly AppDbContext _context = context;
        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email) ?? throw new UnauthorizedAccessException("Invalid email or password");
            if (!AuthHelper.VerifiyPassword(password, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            return AuthHelper.GenerateJWTToken(user);
        }

        public Task<string>? RegisterAsync(string email, string password)
        {
            throw new NotImplementedException();
        }
    }
}