namespace backend.src.DTOs.TaskDTOs
{
    public class TaskResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = null!;
        public string Priority { get; set; } = null!;
        public bool Completed { get; set; }


        public int BoardId { get; set; }
        public string? BoardName { get; set; }


        public int AssignedUserId { get; set; }
        public string? AssignedUserName { get; set; }


        public List<string> Labels { get; set; } = [];
        public List<TaskCommentResponse> Comments { get; set; } = [];
    }

    public class TaskCommentResponse
    {
        public int Id { get; set; }
        public string Comment { get; set; } = null!;
        public DateTime CreatedAt { get; set; }


        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
    }
}
