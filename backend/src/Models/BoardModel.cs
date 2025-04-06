using backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

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

        
        [NotMapped]
        public ICollection<TaskModel>? Tasks 
        { 
            get { return Columns?.SelectMany(c => c.Tasks).ToList(); } 
        }
        
        public ICollection<BoardUser> BoardUsers { get; set; } = [];
        public ICollection<BoardColumn> Columns { get; set; } = [];

        public static implicit operator Board(List<Board> v)
        {
            throw new NotImplementedException();
        }
    }
}


