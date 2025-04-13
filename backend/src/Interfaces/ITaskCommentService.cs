using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.Interfaces
{
    public interface ITaskCommentService
    {
        Task<TaskCommentResponse> CreateCommentAsync(TaskCommentRequest comment, int taskId);
        Task<TaskCommentResponse> GetCommentByIdAsync(int taskId, int commentId);
        Task<IEnumerable<TaskCommentResponse>> GetCommentsByTaskIdAsync(int taskId);
        Task<TaskCommentResponse> UpdateCommentAsync(int taskId, CommentRequest request, int commentId);
        Task DeleteAllComments(int id);
        Task DeleteComment(int taskId, int commentId);
    }
}
