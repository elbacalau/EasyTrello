using backend.Models;

namespace backend.src.DTOs.BoardDTOs
{
    public class AssignUserRequest
    {
        public required int BoardId { get; set; }
        public required int UserId { get; set; }
        public BoardRole? Role { get; set; }
    }
}