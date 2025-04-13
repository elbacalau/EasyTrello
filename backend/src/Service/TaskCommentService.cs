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
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");

      task.Comments ??= [];

      int userId = _functions.GetUserId();

      BoardUser boardRole = await _context.BoardUsers
        .FirstOrDefaultAsync(bu => bu.UserId == userId && bu.BoardId == task.BoardId) ??
        throw new ArgumentException("User not found or not part of the board");

      if (boardRole.Role == BoardRole.Viewer)
      {
        throw new UnauthorizedAccessException("User does not have permission to add comments to this task");
      }

      var newComment = _mapper.Map<TaskComment>(comment);
      User user = await _context.Users.FindAsync(userId) ??
        throw new ArgumentException("User not found");
      newComment.TaskId = taskId;
      newComment.UserId = userId;
      newComment.User = user;

      task.Comments.Add(newComment);

      await _context.SaveChangesAsync();
      return _mapper.Map<TaskCommentResponse>(newComment);
    }

    public async Task DeleteAllComments(int taskId)
    {
      TaskModel task = await _context.Tasks
        .Include(t => t.Comments)
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");

      IEnumerable<TaskComment> comments = task.Comments;
      _context.TaskComments.RemoveRange(comments);
      await _context.SaveChangesAsync();
    }

    public async Task DeleteComment(int taskId, int commentId)
    {
      TaskModel taskComments = await _context.Tasks
        .Include(t => t.Comments)
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");

      TaskComment comment = taskComments.Comments
        .FirstOrDefault(c => c.Id == commentId) ??
        throw new ArgumentException("Comment not found");

      _context.TaskComments.Remove(comment);
      await _context.SaveChangesAsync();
    }

    public async Task<TaskCommentResponse> GetCommentByIdAsync(int taskId, int commentId)
    {
      TaskModel task = await _context.Tasks
        .Include(t => t.Comments)
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");

      TaskComment comment = task.Comments.FirstOrDefault(c => c.Id == commentId) ??
        throw new ArgumentException("Comment not found");

      return _mapper.Map<TaskCommentResponse>(comment);
    }

    public async Task<IEnumerable<TaskCommentResponse>> GetCommentsByTaskIdAsync(int taskId)
    {
      TaskModel task = await _context.Tasks
        .Include(t => t.Comments)
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");

      return _mapper.Map<IEnumerable<TaskCommentResponse>>(task.Comments);
    }

    public async Task<TaskCommentResponse> UpdateCommentAsync(int taskId, CommentRequest request, int commentId)
    {
      
      TaskModel task = await _context.Tasks
        .Include(t => t.Comments)
        .FirstOrDefaultAsync(t => t.Id == taskId) ??
        throw new ArgumentException("Task not found");
      TaskComment comment = task.Comments
        .FirstOrDefault(c => c.Id == commentId) ??
        throw new ArgumentException("Comment not found in the specified task");
      comment.Comment = request.NewComment ?? comment.Comment;
      await _context.SaveChangesAsync();
      return _mapper.Map<TaskCommentResponse>(comment);
    }

  }
}