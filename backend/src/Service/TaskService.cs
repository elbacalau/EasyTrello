using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using backend.Data;
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

        public async Task<TaskResponse> CreateTask([FromBody] TaskRequest request)
        {
            // verify the boardId
            var board = await _context.Boards.FindAsync(request.BoardId) ?? throw new ArgumentException("Board not found to create the task");

            // verify the name of the task
            bool taskExists = await _context.Tasks.AnyAsync(t => t.BoardId == request.BoardId && t.Name == request.Name);
            if (taskExists) throw new ArgumentException("Cannot repeat the name");

            

            TaskModel newTask = _mapper.Map<TaskModel>(request);

            _context.Tasks.Add(newTask);
            await _context.SaveChangesAsync();

            return _mapper.Map<TaskResponse>(newTask);

        }

        public async Task DeleteTasks(int boardId, int? taskId)
        {
            List<TaskModel> boardTask = await _context.Tasks.Where(t => t.BoardId == boardId).ToListAsync();
            if (taskId == null)
            {
                _context.Tasks.RemoveRange(boardTask);
            }

            TaskModel removeTask  = boardTask.FirstOrDefault(t => t.Id == taskId)!;

            _context.Tasks.Remove(removeTask);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TaskResponse>> FindTask([FromBody] FindTaskRequest request)
        {
            
            List<TaskModel> tasks = await _context.Tasks.Where(t => t.BoardId == request.BoardId).ToListAsync();
            if (request.TaskId != null)
            {
                return _mapper.Map<List<TaskResponse>>(tasks.Where(t => t.Id == request.TaskId).ToList());
            } 

            return _mapper.Map<List<TaskResponse>>(tasks);
        }
    }
}

