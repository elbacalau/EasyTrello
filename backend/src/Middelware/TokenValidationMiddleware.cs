using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace backend.src.Middelware
{
    public class TokenValidationMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;
        private readonly string _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")!;

        public async Task Invoke(HttpContext context)
        {
            if (!context.Request.Path.StartsWithSegments("/api/auth"))
            {
                var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

                if (authHeader != null && authHeader.StartsWith("Bearer "))
                {
                    var token = authHeader.Substring("Bearer ".Length).Trim();

                    if (token.Split('.').Length != 3)
                    {
                        throw new UnauthorizedAccessException("Invalid token format");
                    }

                    try
                    {
                        var jwtHandler = new JwtSecurityTokenHandler();
                        var jwtToken = jwtHandler.ReadJwtToken(token);

                        if (jwtToken.ValidTo < DateTime.UtcNow)
                        {
                            throw new UnauthorizedAccessException("Token has expired");
                        }

                        // validate signature with the secret key, no 'kid' needed
                        var tokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret)),
                            ValidateIssuer = false,
                            ValidateAudience = false,
                            ClockSkew = TimeSpan.Zero,
                            RequireSignedTokens = true,
                            ValidateLifetime = true,
                            RequireExpirationTime = true
                        };

                        jwtHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);

                        if (validatedToken is not JwtSecurityToken jwtValidatedToken)
                        {
                            throw new UnauthorizedAccessException("Invalid token");
                        }

                        var claims = jwtValidatedToken.Claims.ToList();
                        context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, JwtBearerDefaults.AuthenticationScheme));
                    }
                    catch (SecurityTokenException ex)
                    {
                        throw new UnauthorizedAccessException("Invalid token", ex);
                    }
                    catch (Exception ex)
                    {
                        throw new UnauthorizedAccessException("Error while processing the token", ex);
                    }
                }
                else
                {
                    throw new UnauthorizedAccessException("No token provided");
                }
            }

            await _next(context);
        }
    }
}