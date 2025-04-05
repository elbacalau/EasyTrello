using System.Security.Claims;
using backend.src.DTOs.BoardDTOs;
using backend.src.Middleware;
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

        // get boards from user id
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


        // delete user from one board
        [HttpDelete("{boardId}/user/{userId}")]
        [ServiceFilter(typeof(RoleValidationAttribute))]
        public async Task<IActionResult> DeleteUserFromBoard(int boardId, int userId)
        {
            await _boardService.DeleteUserFromBoard(boardId, userId);
            return NoContent();
        }


        // change user Role
        [HttpPatch("{boardId}/user/{tarjetUserId}")]
        [ServiceFilter(typeof(RoleValidationAttribute))]
        public async Task<IActionResult> ChangeUserRole(int boardId, int tarjetUserId, [FromBody] AssignRoleRequest request)
        {
            // found user id from token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("Usuario no autenticado"));

            await _boardService.ChangeUserRole(userId, boardId, tarjetUserId, request.NewRole.ToString());

            return Ok(new ApiResponse<string>
            {
                Result = "success",
                Detail = "Role actualizado correctamente."
            });

        }


        [HttpPost("{boardId}/addColumn")]
        public async Task<IActionResult> AddColumn(int boardId, [FromBody] AddColumnRequest request)
        {
            var column = await _boardService.AddColumn(boardId, request);
            return Ok(new ApiResponse<AddColumnRequest>
            {
                Result = "success",
                Detail = column
            });
        }

        [HttpDelete("{boardId}/column/{columnId}")]
        public async Task<IActionResult> DeleteAsync(int boardId, int columnId)
        {
            await _boardService.DeleteColumn(boardId, columnId);

            return NoContent();
        }

        [HttpGet("{boardId}/columns")]
        public async Task<IActionResult> GetBoardColumns(int boardId)
        {
            var columns = await _boardService.GetBoardColumns(boardId);
            return Ok(new ApiResponse<List<BoardColumnResponse>>
            {
                Result = "success",
                Detail = columns
            });
        }

        [HttpGet("{boardId}/columns/{columnId}")]
        public async Task<IActionResult> GetBoardColumn(int boardId, int columnId)
        {
            var column = await _boardService.GetBoardColumn(boardId, columnId);
            return Ok(new ApiResponse<BoardColumnResponse>
            {
                Result = "success",
                Detail = column
            });
        }

    }
}
