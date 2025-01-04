using backend.src.DTOs.BoardDTOs;
using backend.src.Models;
using backend.src.Models.backend.src.Models;
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
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBoard(int id)
        {
            List<Board> boards = await _boardService.GetBoards(id);

            return Ok(new ApiResponse<List<Board>>
            {
                Result = "success",
                Detail = boards
            });
        }

    }
}
