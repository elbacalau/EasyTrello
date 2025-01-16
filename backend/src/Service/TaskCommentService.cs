using System.Runtime.InteropServices.Marshalling;
using AutoMapper;
using backend.Data;
using backend.Models;
using backend.src.DTOs.TaskCommentDTOs;
using backend.src.Infrastructure.Helpers;
using backend.src.Interfaces;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.src.Service
{
    public class TaskCommentService(AppDbContext context, IMapper mapper, Functions functions) : ITaskCommentService
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly Functions _functions = functions;

        public async Task<TaskCommentResponse> CreateCommentAsync(TaskCommentRequest comment, int taskId)
        {

            TaskModel task = await _context.Tasks
                .Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.Id == taskId)
                ?? throw new ArgumentException("Task not found");

            task.Comments ??= new List<TaskComment>();


            int userId = _functions.GetUserId();


            BoardUser boardRole = await _context.BoardUsers
                .FirstOrDefaultAsync(bu => bu.UserId == userId && bu.BoardId == task.BoardId)
                ?? throw new ArgumentException("User not found or not part of the board");

            if (boardRole.Role == BoardRole.Viewer)
            {
                throw new UnauthorizedAccessException("User does not have permission to add comments to this task");
            }


            var newComment = _mapper.Map<TaskComment>(comment);
            User user = await _context.Users.FindAsync(userId) ?? throw new ArgumentException("User not found");
            newComment.TaskId = taskId;
            newComment.UserId = userId;
            newComment.User = user;

            task.Comments.Add(newComment);

            await _context.SaveChangesAsync();


            return _mapper.Map<TaskCommentResponse>(newComment);
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