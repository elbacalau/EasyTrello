using backend.src.DTOs.BoardDTOs;

namespace backend.src.DTOs.UserDTOs
{
    public class UserDataResponse
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public bool IsActive { get; set; }

        // Lista de tableros donde está asignado
        public List<BoardResponse> Boards { get; set; } = [];
    }
}
