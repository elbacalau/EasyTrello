using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
using backend.Models;
using backend.src.DTOs.TaskDTOs;
using backend.src.Interfaces;
using backend.src.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;

namespace backend.src.Service
{
    public class TaskService(AppDbContext context, IMapper mapper) : ITaskService
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task<List<TaskResponse>> GetTasksByColumn(int boardId, int columnId)
        {
            
            var column = await _context.BoardColumns
                .Include(c => c.Tasks)
                .FirstOrDefaultAsync(c => c.Id == columnId && c.BoardId == boardId)
                ?? throw new ArgumentException("Columna no encontrada en el tablero especificado");

            return _mapper.Map<List<TaskResponse>>(column.Tasks);
        }

        public async Task<TaskResponse> AssignUserToTask(int taskId, [FromBody] TaskAssignUserRequest request, int boardId, int columnId)
        {
            TaskModel task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.BoardColumnId == columnId)
                ?? throw new ArgumentException("Tarea no encontrada en la columna especificada");

            User newUser = await _context.Users.FindAsync(request.UserId)
                ?? throw new ArgumentException("Usuario no encontrado");

            task.AssignedUser = newUser;
            task.AssignedUserId = request.UserId;

            await _context.SaveChangesAsync();

            return _mapper.Map<TaskResponse>(task);
        }

        public async Task<TaskResponse> CompleteTask(int taskId, [FromBody] CompleteTaskRequest request, int boardId, int columnId)
        {
            TaskModel task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.BoardColumnId == columnId)
                ?? throw new ArgumentException("Tarea no encontrada en la columna especificada");

            task.Completed = request.Complete;
            await _context.SaveChangesAsync();

            return _mapper.Map<TaskResponse>(task);
        }

        public async Task<TaskResponse> CreateTask([FromBody] TaskRequest request)
        {
            var board = await _context.Boards.FindAsync(request.BoardId)
                ?? throw new ArgumentException("Tablero no encontrado");

            var column = await _context.BoardColumns
                .FirstOrDefaultAsync(c => c.Id == request.BoardColumnId && c.BoardId == request.BoardId)
                ?? throw new ArgumentException("Columna no encontrada en el tablero especificado");

            bool taskExists = await _context.Tasks
                .AnyAsync(t => t.BoardColumnId == request.BoardColumnId && t.Name == request.Name);
            
            if (taskExists)
                throw new ArgumentException("Ya existe una tarea con ese nombre en la columna");

            TaskModel newTask = _mapper.Map<TaskModel>(request);

            _context.Tasks.Add(newTask);
            await _context.SaveChangesAsync();

            return _mapper.Map<TaskResponse>(newTask);
        }

        public async Task DeleteTask(int boardId, int columnId, int taskId)
        {
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.BoardColumnId == columnId)
                ?? throw new ArgumentException("Tarea no encontrada en la columna especificada");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAllTasksFromColumn(int boardId, int columnId)
        {
            var column = await _context.BoardColumns
                .Include(c => c.Tasks)
                .FirstOrDefaultAsync(c => c.Id == columnId && c.BoardId == boardId)
                ?? throw new ArgumentException("Columna no encontrada en el tablero especificado");

            _context.Tasks.RemoveRange(column.Tasks);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TaskResponse>> FindTask([FromBody] FindTaskRequest request)
        {
            var query = _context.Tasks
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .Where(t => t.BoardColumnId == request.BoardColumnId);

            if (request.TaskId != null)
            {
                query = query.Where(t => t.Id == request.TaskId);
            }

            var tasks = await query.ToListAsync();
            return _mapper.Map<List<TaskResponse>>(tasks);
        }

        public async Task<TaskResponse> MoveTaskToColumn(int taskId, int boardId, int sourceColumnId, int targetColumnId)
        {
         
            var task = await _context.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.BoardColumnId == sourceColumnId)
                ?? throw new ArgumentException("Tarea no encontrada en la columna de origen");

            var targetColumn = await _context.BoardColumns
                .FirstOrDefaultAsync(c => c.Id == targetColumnId && c.BoardId == boardId)
                ?? throw new ArgumentException("Columna de destino no encontrada en el tablero");

            task.BoardColumnId = targetColumnId;
            await _context.SaveChangesAsync();

            return _mapper.Map<TaskResponse>(task);
        }
    }
}

