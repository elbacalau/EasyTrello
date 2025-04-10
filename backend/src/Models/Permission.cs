namespace backend.src.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Code { get; set; }
        public string? Description { get; set; }
        
        public ICollection<BoardUserPermission> BoardUserPermissions { get; set; } = [];
    }
} 