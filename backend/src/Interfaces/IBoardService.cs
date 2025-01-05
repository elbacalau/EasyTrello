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
    }
}