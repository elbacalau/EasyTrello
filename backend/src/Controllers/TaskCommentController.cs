using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers

{
    [ApiController]
    [Route("api/board/{boardId}/task/{taskId}/comment")]
    [Authorize]
    public class TaskCommentController(TaskCommentService taskCommentService) : ControllerBase
    {
        private readonly TaskCommentService _taskCommentService = taskCommentService;

        
        [HttpPost("")]
        public async Task<IActionResult> CreateComment(int taskId, [FromBody] TaskCommentRequest  request)
        {
            TaskCommentResponse comment = await _taskCommentService.CreateCommentAsync(request, taskId);
            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }

        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllCommentsFromTask(int taskId)
        {
            await _taskCommentService.DeleteAllComments(taskId);
            return NoContent();
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteCommentFromTask(int commentId, int taskId)
        {
            await _taskCommentService.DeleteComment(taskId, commentId);
            return NoContent();
        }
        


        [HttpGet("{commentId}")]
        public async Task<IActionResult> GetCommentById(int commentId, int taskId)
        {
            TaskCommentResponse comment = await _taskCommentService.GetCommentByIdAsync(taskId, commentId);

            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }

        [HttpGet("")]
        public async Task<IActionResult> GetCommentsByTaskId(int taskId)
        {
            IEnumerable<TaskCommentResponse> comments = await _taskCommentService.GetCommentsByTaskIdAsync(taskId);

            return Ok(new ApiResponse<IEnumerable<TaskCommentResponse>>{
                Detail = comments,
                Result = "success"
            });
        }


        [HttpPut("updateComment/{commentId}")]
        public async Task<IActionResult> UpdateComment(int commentId, int taskId, [FromBody] CommentRequest request)
        {
            TaskCommentResponse comment = await _taskCommentService.UpdateCommentAsync(taskId, request, commentId);
            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }
    }
}