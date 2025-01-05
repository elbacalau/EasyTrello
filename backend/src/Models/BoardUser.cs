using backend.src.Models;

namespace backend.Models
{
    public class BoardUser
    {
        public int BoardId { get; set; }
        public Board Board { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public BoardRole Role { get; set; }
    }

    // roles enum
    public enum BoardRole
    {
        Owner = 1,
        Admin = 2,
        User = 3,
        Viewer = 4
    }
}
