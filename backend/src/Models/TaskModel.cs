using System.Text.Json.Serialization;
using backend.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.Models
{
    public class TaskModel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DueDate { get; set; }

        // Enums
        public TaskStatus Status { get; set; } = TaskStatus.ToDo;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        public bool Completed { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
        public int BoardColumnId { get; set; }
        
        [ForeignKey("BoardColumnId")]
        [JsonIgnore]
        public BoardColumn? BoardColumn { get; set; }

       
        public int BoardId { get; set; }
        
        [JsonIgnore]
        [ForeignKey("BoardId")]
        public Board? Board { get; set; }

        public int AssignedUserId { get; set; }
        public User? AssignedUser { get; set; }

        // New fields
        public List<string> Labels { get; set; } = [];
        public List<TaskComment> Comments { get; set; } = [];
    }

    public enum TaskStatus
    {
        ToDo = 1,
        InProgress = 2,
        Completed = 3
    }

    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }
}
