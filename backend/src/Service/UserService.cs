using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.UserDTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Service
{
    public class UserService(AppDbContext context, Functions functions, IMapper mapper, IHttpContextAccessor httpContextAccessor) : IUserService
    {
        private readonly AppDbContext _context = context;
        private readonly Functions _functions = functions;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<User> CreateUserAsync(User user)
        {
            if (string.IsNullOrEmpty(user.Password) || user.Password.Length < 6)
                throw new ArgumentNullException("Password must be at least 6 characters long");

            try
            {
                user.Password = _functions.EncryptPassword(user.Password);
                
                user.DateCreated = DateTime.UtcNow;
                user.IsActive = true; 
                
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en CreateUserAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<UserResponse> GetUserByIdAsync(int id)
        {
            User user = await _context.Users.FindAsync(id)
                ?? throw new ArgumentException("User not found");


            UserResponse userResponse = _mapper.Map<UserResponse>(user);
            return userResponse;
        }

        public async Task<UserDataResponse> GetUserData()
        {
            var userId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? throw new UnauthorizedAccessException("Usuario no autenticado"));

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .ProjectTo<UserDataResponse>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (user == null)
                throw new ArgumentException("Usuario no encontrado.");

            return user;
        }

        public async Task<List<UserResponse>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<UserResponse>>(users);
        }
    }
}