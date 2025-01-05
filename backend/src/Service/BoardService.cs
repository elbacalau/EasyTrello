using System.Security.Claims;
using AutoMapper;
using backend.Data;
using backend.Models;
using backend.src.DTOs.BoardDTOs;
using backend.src.Interfaces;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Service
{
    public class BoardService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper) : IBoardService
    {
        private readonly AppDbContext _context = context;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMapper _mapper = mapper;

        public async Task<BoardResponse> AssignUserToBoard(AssignUserRequest assignUserRequest)
        {
            // verify if board and user exists
            Board board = _context.Boards.SingleOrDefault(b => b.Id == assignUserRequest.BoardId) ?? throw new ArgumentException("Board not found");
            User user = _context.Users.SingleOrDefault(u => u.Id == assignUserRequest.UserId) ?? throw new ArgumentException("User not found");

            board.AssignedUsers.Add(user);
            board.AssignedUserId = user.Id;

            _context.Boards.Update(board);
            await _context.SaveChangesAsync();


            return _mapper.Map<BoardResponse>(board);
        }

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

            User creatorUser = await _context.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");

            var newBoard = _mapper.Map<Board>(board);
            newBoard.CreatedByUserId = userId;
            newBoard.BackgroundColor = "#FFFFFF";
            newBoard.CreatedAt = DateTime.UtcNow;
            newBoard.UpdatedAt = DateTime.UtcNow;
            newBoard.AssignedUsers.Add(creatorUser);

            _context.Boards.Add(newBoard);
            await _context.SaveChangesAsync();

            return _mapper.Map<BoardRequest>(newBoard);
        }

        public async System.Threading.Tasks.Task DeleteBoard(int boardId)
        {
            // found board
            Board board = await _context.Boards.FindAsync(boardId) ?? throw new ArgumentException("Board not found");
            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();
        }

        public async System.Threading.Tasks.Task DeleteBoards(int userId)
        {
            // found boards
            List<Board> boards = await _context.Boards
                .Where(b => b.CreatedByUserId == userId)
                .ToListAsync();

            if (!boards.Any())
            {
                throw new ArgumentException("No boards found for the given user.");
            }          
            _context.Boards.RemoveRange(boards);
            await _context.SaveChangesAsync(); 

        }

        public Task<List<BoardResponse>> GetBoards(int userId)
        {
            // found user
            var user = _context.Users.FirstOrDefault(u => u.Id == userId) ?? throw new UnauthorizedAccessException("User not found");

            var boards = _context.Boards
                .Where(b => b.CreatedByUserId == userId)
                .Include(b => b.AssignedUsers)
                .ToList();

            return System.Threading.Tasks.Task.FromResult(_mapper.Map<List<BoardResponse>>(boards));
        }
        


    }
}