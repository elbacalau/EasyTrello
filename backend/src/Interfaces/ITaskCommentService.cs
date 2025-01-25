using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Interfaces
{
    public interface ITaskCommentService
    {
        Task<TaskCommentResponse> CreateCommentAsync(TaskCommentRequest comment, int taskId);
        Task<TaskCommentResponse> GetCommentByIdAsync(int id,  CommentRequest request);
        Task<IEnumerable<TaskCommentResponse>> GetCommentsByTaskIdAsync(int taskId);
        Task<TaskCommentResponse> UpdateCommentAsync(int taskId, CommentRequest request);
        Task DeleteCommentAsync(int id);
    }
}
