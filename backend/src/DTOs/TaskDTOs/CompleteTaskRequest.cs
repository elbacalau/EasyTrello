using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.TaskDTOs
{
    public class CompleteTaskRequest
    {
        public required bool Complete { get; set; }
    }
}