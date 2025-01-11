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
        Task<List<TaskResponse>> FindTask([FromBody] FindTaskRequest request);
        Task<TaskResponse> CreateTask([FromBody] TaskRequest taskModel);
        Task DeleteTasks(int boardId, int? taskId);
        Task<TaskResponse> AssignUserToTask(int taskId, [FromBody] AssignUserRequest request, int boardId);
        Task<TaskResponse> CompleteTask(int taskId, [FromBody] CompleteTaskRequest request, int boardId);
    }
}