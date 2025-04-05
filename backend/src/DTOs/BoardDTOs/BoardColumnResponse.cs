using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.src.DTOs.TaskDTOs;

namespace backend.src.DTOs.BoardDTOs
{
    public class BoardColumnResponse
    {
        public int Id { get; set; }
        public required string ColumnName { get; set; }
        public int BoardId { get; set; }
        public ICollection<TaskResponse> Tasks { get; set; } = [];
    }
}