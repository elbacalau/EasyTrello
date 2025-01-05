using backend.src.DTOs.BoardDTOs;
using backend.src.Models.backend.src.Models;

namespace backend.src.Interfaces
{
    public interface IBoardService
    {
        Task<BoardRequest> CreateBoard(BoardRequest board);
        Task<List<BoardResponse>> GetBoards(int userId);
        Task<BoardResponse> AssignUserToBoard(AssignUserRequest assignUserRequest);
    }
}