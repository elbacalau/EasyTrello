namespace backend.src.DTOs.TaskCommentDTOs
{
    public class TaskCommentResponse
    {
        public int Id { get; set; }
        public string Comment { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
    }
}