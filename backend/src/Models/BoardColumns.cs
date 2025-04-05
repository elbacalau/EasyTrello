using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.Models
{
    public class BoardColumn
    {
        public int Id { get; set; }
        public required string ColumnName { get; set; }
        
        public ICollection<TaskModel> Tasks { get; set; } = [];
        
        public int BoardId { get; set; }
        
        [ForeignKey("BoardId")]
        public Board Board { get; set; } = null!;
    }
}
