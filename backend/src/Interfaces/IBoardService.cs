using backend.Models;
using backend.src.DTOs.BoardDTOs;
namespace backend.src.Interfaces
{
    public interface IBoardService
    {
        Task<BoardRequest> CreateBoard(BoardRequest board);
        Task<List<BoardResponse>> GetBoards(int userId);
        Task<BoardResponse> AssignUserToBoard(AssignUserRequest assignUserRequest);
        Task DeleteBoard(int boardId);
        Task DeleteBoards(int userId);
        Task DeleteUserFromBoard(int userId, int boardId);
        Task ChangeUserRole(int userId, int boardId, int targetUserId, string newRole);
        Task<AddColumnRequest> AddColumn(int boardId, AddColumnRequest request);
        Task DeleteColumn(int boardId, int columnId);
        Task<List<BoardColumnResponse>> GetBoardColumns(int boardId);
        Task<BoardColumnResponse> GetBoardColumn(int boardId, int columnId);
    }
}