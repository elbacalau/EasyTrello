using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.BoardDTOs;
using backend.src.Interfaces;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;
using backend.src.Services;

namespace backend.src.Service
{
    public class BoardService(AppDbContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper, PermissionService permissionService) : IBoardService
    {
        private readonly AppDbContext _context = context;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMapper _mapper = mapper;
        private readonly PermissionService _permissionService = permissionService;

        public async Task<AddColumnRequest> AddColumn(int boardId, AddColumnRequest request)
        {
            Board board = await _context.Boards
            .Include(b => b.Columns)
            .FirstOrDefaultAsync(b => b.Id == boardId)
            ?? throw new ArgumentException("Board not found");

            if (board.Columns.Any(c => c.ColumnName == request.NewColumn))
            {
                throw new ArgumentException("A column with this name already exists in the board");
            }

            var newColumn = new BoardColumn
            {
                ColumnName = request.NewColumn,
                BoardId = board.Id
            };

            _context.BoardColumns.Add(newColumn);
            await _context.SaveChangesAsync();

            return new AddColumnRequest
            {
                NewColumn = newColumn.ColumnName
            };
        }

        public async Task<BoardResponse> AssignUserToBoard(AssignUserRequest assignUserRequest)
        {
            var board = await _context.Boards
                .Include(b => b.BoardUsers)
                .FirstOrDefaultAsync(b => b.Id == assignUserRequest.BoardId)
                ?? throw new ArgumentException("Board not found");

            var user = await _context.Users.FindAsync(assignUserRequest.UserId)
                ?? throw new ArgumentException("User not found");

            if (board.BoardUsers.Any(bu => bu.UserId == assignUserRequest.UserId))
            {
                throw new ArgumentException("User is already assigned to this board.");
            }

            // By default, new users are added with the "User" role
            var role = assignUserRequest.Role ?? BoardRole.User;

            var boardUser = new BoardUser
            {
                BoardId = assignUserRequest.BoardId,
                UserId = assignUserRequest.UserId,
                Role = role
            };

            board.BoardUsers.Add(boardUser);
            await _context.SaveChangesAsync();
            
            // Asignar permisos basados en el rol asignado
            await _permissionService.AssignRolePermissionsAsync(assignUserRequest.UserId, assignUserRequest.BoardId, role);

            var boardResponse = _mapper.Map<BoardResponse>(board);

            return boardResponse;
        }

        public async Task ChangeUserRole(int userId, int boardId, int targetUserId, string newRole)
        {
            // Parse string to enum
            if (!Enum.TryParse<BoardRole>(newRole, out var role))
            {
                throw new ArgumentException("Invalid role");
            }

            // verify the actual role from user
            BoardUser boardUser = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.BoardId == boardId && bu.UserId == userId) ?? throw new UnauthorizedAccessException("You are not assigned to this board.");

            if (boardUser.Role != BoardRole.Owner && boardUser.Role != BoardRole.Admin)
            {
                throw new UnauthorizedAccessException("Only Admin or Owner can change user roles.");
            }

            // change role for the tarjet user
            var tarjetBoardRole = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.UserId == targetUserId && bu.BoardId == boardId) ?? throw new ArgumentException("Target user is not assigned to this board.");

            // Guardar el rol antiguo para comprobar si ha cambiado
            var oldRole = tarjetBoardRole.Role;
            
            tarjetBoardRole.Role = role;
            await _context.SaveChangesAsync();
            
            // Solo reasignar permisos si el rol ha cambiado
            if (oldRole != role)
            {
                // Eliminar permisos anteriores
                var oldPermissions = await _context.BoardUserPermissions
                    .Where(p => p.BoardId == boardId && p.UserId == targetUserId)
                    .ToListAsync();
                    
                _context.BoardUserPermissions.RemoveRange(oldPermissions);
                await _context.SaveChangesAsync();
                
                // Asignar nuevos permisos basados en el nuevo rol
                await _permissionService.AssignRolePermissionsAsync(targetUserId, boardId, role);
            }
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
            
            // Asignar permisos basados en el rol de Owner
            await _permissionService.AssignRolePermissionsAsync(userId, newBoard.Id, BoardRole.Owner);

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
            _context.Boards.RemoveRange((IEnumerable<Board>)boards);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteColumn(int boardId, int columnId)
        {
            Board board = await _context.Boards
                .Include(b => b.Columns)
                .FirstOrDefaultAsync(b => b.Id == boardId)
                ?? throw new ArgumentException("No boards found");

            BoardColumn boardColumn = board.Columns.FirstOrDefault(bc => bc.Id == columnId)
                ?? throw new ArgumentException("No column found");

            _context.BoardColumns.Remove(boardColumn);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserFromBoard(int boardId, int userId)
        {
            // founbd user and board
            BoardUser boardUser = await _context.BoardUsers.FirstOrDefaultAsync(bu => bu.BoardId == boardId && bu.UserId == userId) ?? throw new ArgumentException("User is not assigned to this board.");

            _context.BoardUsers.Remove(boardUser);
            await _context.SaveChangesAsync();
        }

        public async Task<List<BoardResponse>> GetBoards(int userId)
        {

            var user = await _context.Users.FindAsync(userId)
                ?? throw new UnauthorizedAccessException("Usuario no encontrado");

            var boards = await _context.Boards
                .AsNoTracking()
                .Where(b => b.CreatedByUserId == userId || b.BoardUsers.Any(bu => bu.UserId == userId))
                .Include(b => b.BoardUsers)
                    .ThenInclude(bu => bu.User)
                .Include(b => b.Columns)
                    .ThenInclude(t => t.Tasks)
                .ToListAsync();


            var boardResponses = _mapper.Map<List<BoardResponse>>(boards);

            return boardResponses;
        }

        public async Task<List<BoardColumnResponse>> GetBoardColumns(int boardId)
        {
            try
            {

                var board = await _context.Boards
                    .AsNoTracking()
                    .FirstOrDefaultAsync(b => b.Id == boardId)
                    ?? throw new ArgumentException("Tablero no encontrado");


                var columns = await _context.BoardColumns
                    .AsNoTracking()
                    .Where(c => c.BoardId == boardId)
                    .Include(c => c.Tasks)
                        .ThenInclude(t => t.Comments)
                            .ThenInclude(c => c.User)
                    .Include(c => c.Tasks)
                        .ThenInclude(t => t.AssignedUser)
                    .ToListAsync();

                var columnResponses = _mapper.Map<List<BoardColumnResponse>>(columns);

                return columnResponses;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetBoardColumns: {ex.Message}");
                throw;
            }
        }

        public async Task<BoardColumnResponse> GetBoardColumn(int boardId, int columnId)
        {
            try
            {
                var column = await _context.BoardColumns
                    .AsNoTracking()
                    .Where(c => c.Id == columnId && c.BoardId == boardId)
                    .Include(c => c.Tasks)
                        .ThenInclude(t => t.Comments)
                            .ThenInclude(c => c.User)
                    .Include(c => c.Tasks)
                        .ThenInclude(t => t.AssignedUser)
                    .FirstOrDefaultAsync()
                    ?? throw new ArgumentException("Columna no encontrada en el tablero especificado");

                var columnResponse = _mapper.Map<BoardColumnResponse>(column);

                return columnResponse;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetBoardColumn: {ex.Message}");
                throw;
            }
        }

        public async Task<BoardStatsResponse> GetBoardStats(int boardId)
        {
            Board board = await _context.Boards
                .FirstOrDefaultAsync(b => b.Id == boardId)
                ?? throw new ArgumentException("Tablero no encontrado");

            List<BoardColumn> columns = await _context.BoardColumns
                .Where(c => c.BoardId == boardId)
                .Include(c => c.Tasks)
                .AsNoTracking()
                .ToListAsync();

            int pendingTasks = 0;
            int completedTasks = 0;

            foreach (BoardColumn col in columns)
            {
              for (int i = 0; i < col.Tasks.Count; i++) {
                TaskModel task = col.Tasks[i];
                if (task.Completed) {
                  completedTasks++;
                } else {
                  pendingTasks++;
                }
              }
            }

            return new BoardStatsResponse
            {
                PendingTasks = pendingTasks,
                CompletedTasks = completedTasks
            };
        }

        public async Task<List<BoardResponse>> GetAllBoardsWithUsers()
        {
            try
            {
                var boards = await _context.Boards
                    .AsNoTracking()
                    .Include(b => b.BoardUsers)
                        .ThenInclude(bu => bu.User)
                    .Include(b => b.Columns)
                    .ToListAsync();

                var boardResponses = _mapper.Map<List<BoardResponse>>(boards);

                return boardResponses;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en GetAllBoardsWithUsers: {ex.Message}");
                throw;
            }
        }

        public async Task<List<UserResponse>> GetAssignedUsers(int boardId)
        {
            try
            {
                Board board = await _context.Boards
                    .AsNoTracking()
                    .Include(b => b.BoardUsers)
                        .ThenInclude(bu => bu.User)
                    .FirstOrDefaultAsync(b => b.Id == boardId)
                    ?? throw new ArgumentException("Board not found");

                return [.. board.BoardUsers.Select(bu => _mapper.Map<UserResponse>(bu.User))];
            }
            catch (System.Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}