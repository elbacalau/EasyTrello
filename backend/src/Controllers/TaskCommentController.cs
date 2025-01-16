using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers

{
    [ApiController]
    [Route("api/board/{boardId}/task/comment")]
    public class TaskCommentController(TaskCommentService taskCommentService) : ControllerBase
    {
        private readonly TaskCommentService _taskCommentService = taskCommentService;


        [HttpPost("{taskId}")]
        public async Task<IActionResult> CreateComment(int taskId, [FromBody] TaskComment request)
        {
            TaskComment comment = await _taskCommentService.CreateCommentAsync(request, taskId);

            return Ok(new ApiResponse<TaskComment>{
                Detail = comment,
                Result = "success"
            });
        }


    }
}