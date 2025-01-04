using backend.src.DTOs;

namespace backend.src.Interfaces
{
    public interface IAuthService
    {
        Task<string>? LoginAsync(string email, string password);

        Task<RegisterRequest>? RegisterAsync(RegisterRequest request);
    }
}