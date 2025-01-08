using backend.Models;

namespace backend.src.Models
{
    public class TaskComment
    {
        public int Id { get; set; }
        public required string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TaskId { get; set; }
        public TaskModel Task { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
