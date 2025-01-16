using backend.src.Models;

namespace backend.src.Interfaces
{
    public interface ITaskCommentService
    {
        Task<TaskComment> CreateCommentAsync(TaskComment comment, int taskId);
        Task<TaskComment?> GetCommentByIdAsync(int id);
        Task<IEnumerable<TaskComment>> GetCommentsByTaskIdAsync(int taskId);
        Task<TaskComment> UpdateCommentAsync(int id, string updatedText);
        Task<bool> DeleteCommentAsync(int id);
    }
}
