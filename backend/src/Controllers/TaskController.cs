using backend.src.DTOs.TaskDTOs;
using backend.src.Middleware;
using backend.src.Models;
using backend.src.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Controllers
{
    [ApiController]
    [Route("api/board/{boardId}/column/{columnId}/task")]
    [Authorize]
    public class TaskController(TaskService task) : ControllerBase
    {   
        private readonly TaskService _taskService = task;

        [HttpGet]
        public async Task<IActionResult> GetTasks(int boardId, int columnId)
        {
            List<TaskResponse> tasks = await _taskService.GetTasksByColumn(boardId, columnId);
            return Ok(new ApiResponse<List<TaskResponse>>
            {
                Result = "success",
                Detail = tasks
            });
        }

        // find a task
        [HttpPost("find")]
        public async Task<IActionResult> FindTask([FromBody] FindTaskRequest request, int boardId, int columnId)
        {
            request.BoardId = boardId;
            request.BoardColumnId = columnId;
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

        // delete a task
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int boardId, int columnId, int taskId)
        {
            await _taskService.DeleteTask(boardId, columnId, taskId);
            return NoContent();
        }

        // assign user to task
        [HttpPut("{taskId}/assignUser")]
        public async Task<IActionResult> AssignUserToTask(int taskId, [FromBody] TaskAssignUserRequest request, int boardId, int columnId)
        {
            TaskResponse response = await _taskService.AssignUserToTask(taskId, request, boardId, columnId);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = response
            });
        }

        // Mover tarea a otra columna
        [HttpPatch("{taskId}/moveToColumn/{targetColumnId}")]
        public async Task<IActionResult> MoveTaskToColumn(int taskId, int boardId, int columnId, int targetColumnId)
        {
            TaskResponse taskResponse = await _taskService.MoveTaskToColumn(taskId, boardId, columnId, targetColumnId);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = taskResponse
            });
        }

        [HttpPatch("{taskId}/complete")]
        public async Task<IActionResult> CompleteTask(int taskId, [FromBody] CompleteTaskRequest request, int boardId, int columnId)
        {
            TaskResponse taskResponse = await _taskService.CompleteTask(taskId, request, boardId, columnId);
            return Ok(new ApiResponse<TaskResponse>{
                Result = "success",
                Detail = taskResponse
            });
        }
    }
}