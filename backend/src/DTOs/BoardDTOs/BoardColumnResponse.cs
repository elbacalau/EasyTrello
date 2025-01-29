using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.BoardDTOs
{
    public class BoardColumnResponse
    {
        public int Id { get; set; }
        public required string ColumnName { get; set; }
        

    }
}