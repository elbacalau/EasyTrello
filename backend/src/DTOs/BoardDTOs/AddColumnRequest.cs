using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.DTOs.BoardDTOs
{
    public class AddColumnRequest
    {
        public required string NewColumn {get; set;}
    }
}