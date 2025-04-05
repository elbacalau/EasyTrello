using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.src.DTOs.TaskDTOs;
using backend.src.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Interfaces
{
    public interface ITaskService
    {
        Task<List<TaskResponse>> GetTasksByColumn(int boardId, int columnId);
        Task<List<TaskResponse>> FindTask([FromBody] FindTaskRequest request);
        Task<TaskResponse> CreateTask([FromBody] TaskRequest taskModel);
        Task DeleteTask(int boardId, int columnId, int taskId);
        Task DeleteAllTasksFromColumn(int boardId, int columnId);
        Task<TaskResponse> AssignUserToTask(int taskId, [FromBody] TaskAssignUserRequest request, int boardId, int columnId);
        Task<TaskResponse> MoveTaskToColumn(int taskId, int boardId, int sourceColumnId, int targetColumnId);
        Task<TaskResponse> CompleteTask(int taskId, [FromBody] CompleteTaskRequest request, int boardId, int columnId);
    }
}