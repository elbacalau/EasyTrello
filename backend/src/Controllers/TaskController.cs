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

        // find a task
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


        // delete a task from board or all task from the board
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTasks(int boardId, int? taskId)
        {
            await _taskService.DeleteTasks(boardId, taskId);
            return NoContent();
        }


        // assign user to task
        [HttpPut("{taskId}/assignUser")]
        public async Task<IActionResult> AssignUserToTask(int taskId, [FromBody] TaskAssignUserRequest request, int boardId)
        {
            TaskResponse response = await _taskService.AssignUserToTask(taskId, request, boardId);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = response
            });
        }


        [HttpPatch("{taskId}/complete")]
        public async Task<IActionResult> CompleteTask(int taskId, [FromBody] CompleteTaskRequest request, int boardId)
        {
            TaskResponse taskResponse = await _taskService.CompleteTask(taskId, request, boardId);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = taskResponse
            });
        }

        

    }
}