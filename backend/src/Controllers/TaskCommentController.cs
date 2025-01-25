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
        public async Task<IActionResult> DeleteCommentAsync(int taskId, [FromBody] CommentRequest request)
        {
            await _taskCommentService.DeleteCommentAsync(taskId, request);
            return NoContent();
        }


        [HttpPost("{taskId}/find")]
        public async Task<IActionResult> GetCommentById(int taskId, [FromBody] CommentRequest request)
        {
            TaskCommentResponse comment = await _taskCommentService.GetCommentByIdAsync(taskId, request);

            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }

        [HttpGet("{taskId}")]
        public async Task<IActionResult> GetCommentsByTaskId(int taskId)
        {
            IEnumerable<TaskCommentResponse> comments = await _taskCommentService.GetCommentsByTaskIdAsync(taskId);

            return Ok(new ApiResponse<IEnumerable<TaskCommentResponse>>{
                Detail = comments,
                Result = "success"
            });
        }


        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateComment(int taskId, [FromBody] CommentRequest request)
        {
            TaskCommentResponse comment = await _taskCommentService.UpdateCommentAsync(taskId, request);

            return Ok(new ApiResponse<TaskCommentResponse>{
                Detail = comment,
                Result = "success"
            });
        }
    }
}