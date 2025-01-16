using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers

{
    [ApiController]
    [Route("api/board/{boardId}/task/comment")]
    [Authorize]
    public class TaskCommentController(TaskCommentService taskCommentService) : ControllerBase
    {
        private readonly TaskCommentService _taskCommentService = taskCommentService;


        [HttpPost("{taskId}")]
        public async Task<IActionResult> CreateComment(int taskId, [FromBody] TaskCommentRequest  request)
        {
            TaskCommentResponse comment = await _taskCommentService.CreateCommentAsync(request, taskId);

            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteCommentAsync(int taskId, [FromBody] DeleteCommentRequest request)
        {
            await _taskCommentService.DeleteCommentAsync(taskId, request);
            return NoContent();
        }


    }
}