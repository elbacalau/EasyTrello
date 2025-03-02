using backend.src.Models;

namespace backend.src.DTOs.BoardDTOs
{
    public class BoardResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Status { get; set; } = null!;
        public string? Visibility { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<UserResponse> AssignedUsers { get; set; } = [];
        public ICollection<BoardColumnResponse> BoardColumns { get; set; } = [];
        public string? BackgroundColor { get; set; }
    }

}