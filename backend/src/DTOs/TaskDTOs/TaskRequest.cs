namespace backend.src.DTOs.TaskDTOs
{
    public class TaskRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = "ToDo";
        public string Priority { get; set; } = "Medium";
        public int BoardId { get; set; }
        public int BoardColumnId { get; set; }
        public int AssignedUserId { get; set; }
        public bool Completed { get; set; } = false;
        public List<string> Labels { get; set; } = [];
    }
}
