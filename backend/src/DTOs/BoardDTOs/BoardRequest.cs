using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.BoardDTOs
{
    public class BoardRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; } 
        public required string Status { get; set; } 
        public string? Visibility { get; set; } 

    }
}