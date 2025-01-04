namespace backend.src.Infrastructure.Helpers
{
    public class Functions
    {
        public string EncryptPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}