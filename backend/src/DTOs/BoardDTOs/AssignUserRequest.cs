using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.BoardDTOs
{
    public class AssignUserRequest
    {
        public required int BoardId { get; set; }
        public required int UserId { get; set; }
    }
}