namespace backend.src.DTOs
{
    public class UserResponse
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }

        public string? Role { get; set; }
    }
}