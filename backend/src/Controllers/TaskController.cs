using backend.src.DTOs.TaskDTOs;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/board/{boardId}/task")]
    [Authorize]
    public class TaskController(TaskService task) : ControllerBase
    {   
        private readonly TaskService _taskService = task;


        [HttpPost("find")]
        public async Task<IActionResult> FindTask([FromBody] FindTaskRequest request)
        {
            List<TaskResponse> tasks = await _taskService.FindTask(request);
            return Ok(new ApiResponse<List<TaskResponse>>
            {
                Result = "success",
                Detail = tasks
            });
        }


        // create task
        [HttpPost("create")]
        public async Task<IActionResult> CreateTask([FromBody] TaskRequest request)
        {
            TaskResponse taskResponse = await _taskService.CreateTask(request);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = taskResponse
            });
        }



        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTasks(int boardId, int? taskId)
        {
            await _taskService.DeleteTasks(boardId, taskId);
            return NoContent();
        }

    }
}