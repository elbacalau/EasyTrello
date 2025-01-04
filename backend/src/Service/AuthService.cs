using backend.Data;
using backend.Models;
using backend.src.DTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Service
{
    public class AuthService(AppDbContext context, Functions functions) : IAuthService
    {
        private readonly AppDbContext _context = context;
        private readonly Functions _functions = functions;
        public async Task<string> LoginAsync(string email, string password)
        {

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email) ?? throw new UnauthorizedAccessException("Invalid email or password");
            if (!AuthHelper.VerifiyPassword(password, user.Password))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }
            return AuthHelper.GenerateJWTToken(user);
        }


        public async Task<RegisterRequest>? RegisterAsync(RegisterRequest request)
        {   
            bool userExists = _context.Users.Any(x => x.Email == request.Email);
            if (userExists)
            {
                throw new UnauthorizedAccessException("User with this email already exists");
            }

            // validate email
            bool isEmail = Validators.IsEmail(request.Email);
            if (!isEmail)
            {
                throw new UnauthorizedAccessException("Invalid email");
            }
            
            // validate password
            bool isPasswordValid = Validators.IsPasswordValid(request.Password);
            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit");
            }

            // validate phone number
            bool isPhoneNumberValid = Validators.IsPhoneNumberValid(request.PhoneNumber);
            if (!isPhoneNumberValid)
            {
                throw new UnauthorizedAccessException("Invalid phone number");
            }

            
            User newUser = new()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                PhoneNumber = request.PhoneNumber,
                DateCreated = DateTime.Now
            };

            // hash password
            newUser.Password = _functions.EncryptPassword(newUser.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return request;
        }


    }
}