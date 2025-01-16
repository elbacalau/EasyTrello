using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.TaskDTOs
{
    public class TaskAssignUserRequest
    {
        public required int UserId { get; set; }
    }
}