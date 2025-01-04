using backend.Models;

namespace backend.src.Models
{
    public class Task
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public required string Status { get; set; }
    public int BoardId { get; set; }
    public int AssignedUserId { get; set; }
    public required string Priority { get; set; }
    public bool Completed { get; set; }
    public DateTime? DeletedAt { get; set; }

    
    public Board? Board { get; set; }
    public User? AssignedUser { get; set; }
}

}