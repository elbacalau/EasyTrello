using System.Security.Claims;
using AutoMapper;
using backend.Data;
using backend.src.DTOs.BoardDTOs;
using backend.src.Interfaces;
using backend.src.Models.backend.src.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

namespace backend.src.Service
{
    public class BoardService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper) : IBoardService
    {
        private readonly AppDbContext _context = context;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMapper _mapper = mapper;

        public async Task<BoardRequest> CreateBoard(BoardRequest board)
        {
            // get user id
            var userId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("Usuario no autenticado"));

            // get all boards from user to verify if the name doesn't exists
            var boardsUser = _context.Boards.Where(b => b.AssignedUserId == userId);

            foreach (Board b in boardsUser)
            {
                if (b.Name == board.Name)
                {
                    throw new ArgumentException("El nombre del tablero ya existe");
                }
            }

            var newBoard = _mapper.Map<Board>(board);
            newBoard.CreatedByUserId = userId;
            newBoard.BackgroundColor = "#FFFFFF";
            newBoard.CreatedAt = DateTime.UtcNow;
            newBoard.UpdatedAt = DateTime.UtcNow;

            _context.Boards.Add(newBoard);
            await _context.SaveChangesAsync();

            return _mapper.Map<BoardRequest>(newBoard);
        }

        public Task<List<BoardResponse>> GetBoards(int userId)
        {
            // found user
            var user = _context.Users.FirstOrDefault(u => u.Id == userId) ?? throw new UnauthorizedAccessException("User not found");
            List<Board> boards = [.. _context.Boards.Where(b => b.CreatedByUserId == userId)];
            return Task.FromResult(boards.Select(b => _mapper.Map<BoardResponse>(b)).ToList());
        }

        
    }
}