using backend.src.DTOs.BoardDTOs;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/board")]
    [Authorize]
    public class BoardController(BoardService boardService) : ControllerBase
    {
        private readonly BoardService _boardService = boardService;
        [HttpPost("create")]
        public async Task<IActionResult> CreateBoard([FromBody] BoardRequest board)
        {
            BoardRequest boardRequest = await _boardService.CreateBoard(board);
            return Ok(new ApiResponse<BoardRequest>
            {
                Result = "success",
                Detail = boardRequest
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoard(int id)
        {
            List<BoardResponse> boards = await _boardService.GetBoards(id);

            return Ok(new ApiResponse<List<BoardResponse>>
            {
                Result = "success",
                Detail = boards
            });
        }

        // add user to board
        [HttpPut("assignUser")]
        public async Task<IActionResult> AssignUserToBoard([FromBody] AssignUserRequest request)
        {
            BoardResponse response = await _boardService.AssignUserToBoard(request);
            return Ok(new ApiResponse<BoardResponse>
            {
                Result = "success",
                Detail = response
            });
        }


        // delete entirely board from user
        [HttpDelete("{boardId}")]
        public async Task<IActionResult> DeleteBoard(int boardId)
        {
            await _boardService.DeleteBoard(boardId);
            return NoContent();
        }


        // delete all boards from user
        [HttpDelete("deleteByUser/{userId}")]
        public async Task<IActionResult> DeleteBoardsByUserId(int userId)
        {
            await _boardService.DeleteBoards(userId);
            return NoContent(); 
        }

    }
}
