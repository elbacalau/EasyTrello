using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.TaskDTOs
{
    public class FindTaskRequest
    {
        public required int BoardId { get; set; }
        public int? TaskId { get; set; }
    }
}