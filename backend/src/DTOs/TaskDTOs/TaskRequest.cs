using backend.src.Models;

namespace backend.src.DTOs.TaskDTOs
{

    public class TaskRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public Models.TaskStatus Status { get; set; } = Models.TaskStatus.ToDo;
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public required int BoardId { get; set; }
        public required int BoardColumnId { get; set; }
        public required int AssignedUserId { get; set; }
        public bool Completed { get; set; } = false;
        public List<string> Labels { get; set; } = [];
        public List<TaskComment> Comments { get; set; } = [];
    }
}
