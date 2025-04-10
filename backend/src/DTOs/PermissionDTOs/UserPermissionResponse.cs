using backend.Models;
using backend.src.Models;
using System.Collections.Generic;

namespace backend.src.DTOs.PermissionDTOs
{
    public class UserPermissionResponse
    {
        public int UserId { get; set; }
        public int BoardId { get; set; }
        public BoardRole Role { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public List<PermissionInfo> Permissions { get; set; } = [];
    }

    public class PermissionInfo
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public bool IsGranted { get; set; }
    }
} 