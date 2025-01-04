using backend.Data;
using backend.src.DTOs.BoardDTOs;
using backend.src.Interfaces;
using backend.src.Models.backend.src.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

namespace backend.src.Service
{
    public class BoardService(AppDbContext context) : IBoardService
    {
        private readonly AppDbContext _context = context;

        public Task<BoardRequest> CreateBoard(BoardRequest board)
        {
            throw new NotImplementedException();
        }

        public Task<List<Board>> GetBoards(int userId)
        {
            // found user
            var user = _context.Users.FirstOrDefault(u => u.Id == userId) ?? throw new UnauthorizedAccessException("User not found");
            List<Board> boards = [.. _context.Boards.Where(b => b.CreatedByUserId == userId)]; 
            return Task.FromResult(boards);
        }

    }
}