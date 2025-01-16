using System.Security.Claims;

namespace backend.src.Infrastructure.Helpers
{
    public class Functions(IHttpContextAccessor httpContextAccessor)
    {
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        // ENCRYPT PASSWORD TO DB
        public string EncryptPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // GET USER ID FROM TOKEN
        public int GetUserId()
        {
            try
            {
                return int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? throw new UnauthorizedAccessException("User not found"));
            }
            catch (Exception ex)
            {
                
                throw new UnauthorizedAccessException("Error: ", ex);
            }
        }
    }
}