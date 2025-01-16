using System.Runtime.InteropServices.Marshalling;
using AutoMapper;
using backend.Data;
using backend.src.Interfaces;
using backend.src.Models;

namespace backend.src.Service
{
    public class TaskCommentService(AppDbContext context, IMapper mapper) : ITaskCommentService
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        
        public async Task<TaskComment> CreateCommentAsync(TaskComment comment, int taskId)
        {
            // find task
            TaskModel task = await _context.Tasks.FindAsync(taskId) ?? throw new ArgumentException("Task not found");

            task.Comments.Add(comment);

            await _context.SaveChangesAsync();

            return comment;

        }

        public Task<bool> DeleteCommentAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<TaskComment?> GetCommentByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TaskComment>> GetCommentsByTaskIdAsync(int taskId)
        {
            throw new NotImplementedException();
        }

        public Task<TaskComment> UpdateCommentAsync(int id, string updatedText)
        {
            throw new NotImplementedException();
        }
    }
}