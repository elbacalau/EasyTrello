using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Interfaces
{
    public interface ITaskCommentService
    {
        Task<TaskCommentResponse> CreateCommentAsync(TaskCommentRequest comment, int taskId);
        Task<TaskCommentResponse> GetCommentByIdAsync(int id, [FromBody] CommentRequest request);
        Task<IEnumerable<TaskCommentResponse>> GetCommentsByTaskIdAsync(int taskId);
        Task<TaskComment> UpdateCommentAsync(int id, string updatedText);
        Task DeleteCommentAsync(int id, [FromBody] CommentRequest request);
    }
}
