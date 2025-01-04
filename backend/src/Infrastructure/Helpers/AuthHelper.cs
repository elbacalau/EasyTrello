using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.src.Infrastructure.Helpers
{
    public class AuthHelper
    {
        public static string GenerateJWTToken(User user)
        {
            var claims = 
            new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.FirstName),
                new(ClaimTypes.Email, user.Email)
                // TODO: Add role claim
            };
            var expitarionTime = Environment.GetEnvironmentVariable("JWT_EXPIRATION_TIME");
            var expiration = string.IsNullOrEmpty(expitarionTime) ? 1 : int.Parse(expitarionTime);

            var jwtToken = new JwtSecurityToken(
                notBefore: DateTime.UtcNow,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiration),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            Environment.GetEnvironmentVariable("JWT_SECRET")!
                        )
                    ),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }


        public static bool VerifiyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}