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

            var existingAssignment = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.BoardId == board.Id && bu.UserId == user.Id);

            if (existingAssignment != null)
            {
                throw new ArgumentException("User is already assigned to this board.");
            }

            var boardUser = new BoardUser
            {
                BoardId = board.Id,
                UserId = user.Id,
                Role = BoardRole.User
            };

            _context.BoardUsers.Add(boardUser);
            await _context.SaveChangesAsync();

            return _mapper.Map<BoardResponse>(board);
        }

        public async Task ChangeUserRole(int userId, int boardId, int targetUserId, string newRole)
        {
            if (!Enum.TryParse<BoardRole>(newRole, true, out var role) || !Enum.IsDefined(typeof(BoardRole), role))
            {
                throw new ArgumentException("Invalid role.");
            }

            // verify the actual role from user
            BoardUser boardUser = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.BoardId == boardId && bu.UserId == userId) ?? throw new UnauthorizedAccessException("You are not assigned to this board.");

            if (boardUser.Role != BoardRole.Owner && boardUser.Role != BoardRole.Admin)
            {
                throw new UnauthorizedAccessException("Only Admin or Owner can change user roles.");
            }

            // change role for the tarjet user
            var tarjetBoardRole = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.UserId == targetUserId && bu.BoardId == boardId) ?? throw new ArgumentException("Target user is not assigned to this board.");

            tarjetBoardRole.Role = role;
            await _context.SaveChangesAsync();
        }

        public async Task<BoardRequest> CreateBoard(BoardRequest board)
        {
            // get user id
            var userId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("Usuario no autenticado"));

            // get all boards from user to verify if the name doesn't exists
            if (_context.Boards.Any(b => b.AssignedUserId == userId && b.Name == board.Name))
            {
                throw new ArgumentException("El nombre del tablero ya existe");
            }


            User creatorUser = await _context.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");

            var newBoard = _mapper.Map<Board>(board);
            newBoard.CreatedByUserId = userId;
            newBoard.BackgroundColor = "#FFFFFF";
            newBoard.CreatedAt = DateTime.UtcNow;
            newBoard.UpdatedAt = DateTime.UtcNow;
            newBoard.Status = "En progreso";

            var defaultColumns = new List<BoardColumn>
            {
                new BoardColumn { ColumnName = "Por hacer", Board = newBoard },
                new BoardColumn { ColumnName = "En progreso", Board = newBoard },
                new BoardColumn { ColumnName = "Completado", Board = newBoard }
            };

            newBoard.Columns = defaultColumns;

            _context.Boards.Add(newBoard);
            await _context.SaveChangesAsync();

            var boardUser = new BoardUser
            {
                BoardId = newBoard.Id,
                UserId = userId,
                Role = BoardRole.Owner
            };

            _context.BoardUsers.Add(boardUser);
            await _context.SaveChangesAsync();

            return _mapper.Map<BoardRequest>(newBoard);
        }

        public async Task DeleteBoard(int boardId)
        {
            // found board
            Board board = await _context.Boards.FindAsync(boardId) ?? throw new ArgumentException("Board not found");
            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBoards(int userId)
        {
            // found boards
            List<Board> boards = await _context.Boards
                .Where(b => b.CreatedByUserId == userId)
                .ToListAsync();

            if (boards.Count == 0)
            {
                throw new ArgumentException("No boards found for the given user.");
            }
            _context.Boards.RemoveRange(boards);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteUserFromBoard(int boardId, int userId)
        {
            // founbd user and board
            BoardUser boardUser = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.BoardId == boardId && bu.UserId == userId) ?? throw new ArgumentException("User is not assigned to this board.");

            _context.BoardUsers.Remove(boardUser);
            await _context.SaveChangesAsync();
        }

        public Task<List<BoardResponse>> GetBoards(int userId)
        {
            // found user
            var user = _context.Users.FirstOrDefault(u => u.Id == userId) ?? throw new UnauthorizedAccessException("User not found");

            List<Board> boards = [.. _context.Boards
                .Where(b => b.CreatedByUserId == userId)
                .Include(b => b.BoardUsers)
                .ThenInclude(bu => bu.User)
                .Include(bc => bc.Columns),
                ];

            boards.ForEach(b =>
            {
                Console.WriteLine("Columnas del tablero: ", b.Columns);
            });

            return Task.FromResult(_mapper.Map<List<BoardResponse>>(boards));
        }



    }
}