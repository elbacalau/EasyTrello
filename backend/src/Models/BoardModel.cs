using backend.Models;


namespace backend.src.Models
{
    
    public class Board
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public required string Status { get; set; }
        public string? Visibility { get; set; }
        public int CreatedByUserId { get; set; }
        public User CreatedByUser { get; set; } = null!;
        public int? AssignedUserId { get; set; }

        public string? BackgroundColor { get; set; }
        public DateTime? DeletedAt { get; set; }

        public ICollection<TaskModel>? Tasks { get; set; } = [];
        public ICollection<BoardUser> BoardUsers { get; set; } = [];

    }
}


