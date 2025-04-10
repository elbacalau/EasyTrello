using backend.Models;

namespace backend.src.Models
{
    public class BoardUserPermission
    {
        public int BoardId { get; set; }
        public int UserId { get; set; }
        public BoardUser BoardUser { get; set; } = null!;
        
        public int PermissionId { get; set; }
        public Permission Permission { get; set; } = null!;
        
       
        public bool IsGranted { get; set; } = true;
    }
} 