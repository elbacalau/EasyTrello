using AutoMapper;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.BoardDTOs;
using backend.src.DTOs.TaskCommentDTOs;
using backend.src.DTOs.TaskDTOs;
using backend.src.DTOs.UserDTOs;
using backend.src.Models;

namespace backend.src.Infrastructure.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<BoardRequest, Board>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Visibility, opt => opt.MapFrom(src => src.Visibility ?? "Público"))
                .ForMember(dest => dest.BackgroundColor, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            CreateMap<User, UserDataResponse>()
                .ForMember(dest => dest.Boards, opt => opt.MapFrom(src => src.BoardUsers.Select(bu => new BoardResponse
                {
                    Id = bu.Board.Id,
                    Name = bu.Board.Name,
                    Description = bu.Board.Description,
                    Status = bu.Board.Status,
                    Visibility = bu.Board.Visibility,
                    CreatedAt = bu.Board.CreatedAt,
                    UpdatedAt = bu.Board.UpdatedAt,
                    BackgroundColor = bu.Board.BackgroundColor,
                    AssignedUsers = bu.Board.BoardUsers.Select(bbu => new UserResponse
                    {
                        FirstName = bbu.User.FirstName,
                        LastName = bbu.User.LastName,
                        Email = bbu.User.Email,
                        PhoneNumber = bbu.User.PhoneNumber!,
                        Role = bbu.Role.ToString()
                    }).ToList()
                }).ToList()));

            // MAPS
            CreateMap<Board, BoardRequest>();
            CreateMap<Board, BoardResponse>()
                .ForMember(dest => dest.AssignedUsers, opt => opt.MapFrom(src => src.BoardUsers.Select(bu => new UserResponse
                {
                    FirstName = bu.User.FirstName,
                    LastName = bu.User.LastName,
                    Email = bu.User.Email,
                    PhoneNumber = bu.User.PhoneNumber!,
                    Role = bu.Role.ToString()
                })));

            CreateMap<User, UserResponse>();

            // MAPS Task
            CreateMap<TaskModel, TaskResponse>()
                .ForMember(dest => dest.BoardName, opt => opt.MapFrom(src => src.Board!.Name))
                .ForMember(dest => dest.AssignedUserName, opt => opt.MapFrom(src => $"{src.AssignedUser!.FirstName} {src.AssignedUser.LastName}"))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
                .ForMember(dest => dest.Labels, opt => opt.MapFrom(src => src.Labels))
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments.Select(c => new TaskCommentResponse
                {
                    Id = c.Id,
                    Comment = c.Comment,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    UserName = $"{c.User.FirstName} {c.User.LastName}"
                }).ToList()));


            CreateMap<TaskRequest, TaskModel>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<Models.TaskStatus>(src.Status, true)))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => Enum.Parse<TaskPriority>(src.Priority, true)));



            // TASK COMMENTS
            CreateMap<TaskCommentRequest, TaskComment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.TaskId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore());

            CreateMap<TaskComment, TaskCommentResponse>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));


            // map TaskModel to TaskResponse
            CreateMap<TaskModel, TaskResponse>()
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments));

            // map TaskComment to TaskCommentResponse
            CreateMap<TaskComment, TaskCommentResponse>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FirstName + " " + src.User.LastName));
        }
    }
}