using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.src.Models;

namespace backend.src.Interfaces
{
    public interface IBoardService
    {
        Task<Board> CreateBoard(Board board);
    }
}