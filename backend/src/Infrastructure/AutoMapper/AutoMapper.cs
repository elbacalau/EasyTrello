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
            // map boardrequest to board
            CreateMap<BoardRequest, Board>()
                .ForMember(dest => dest.Visibility, opt => opt.MapFrom(src => src.Visibility ?? "Público"))
                .ForMember(dest => dest.BackgroundColor, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // map board to boardresponse
            CreateMap<Board, BoardResponse>()
                .ForMember(dest => dest.AssignedUsers, opt => opt.MapFrom(src => src.BoardUsers.Select(bu => new UserResponse
                {
                    Id = bu.UserId,
                    FirstName = bu.User.FirstName,
                    LastName = bu.User.LastName,
                    Email = bu.User.Email,
                    PhoneNumber = bu.User.PhoneNumber,
                    IsActive = bu.User.IsActive
                })))
                .ForMember(dest => dest.BoardColumns, opt => opt.MapFrom(src => src.Columns.Select(c => new BoardColumnResponse
                {
                    Id = c.Id,
                    ColumnName = c.ColumnName,
                    BoardId = c.BoardId
                })));

            // map boardcolumn to boardcolumnresponse
            CreateMap<BoardColumn, BoardColumnResponse>()
                .ForMember(dest => dest.Tasks, opt => opt.MapFrom(src => src.Tasks));

            // map user to userresponse (fixing missing type map issue)
            CreateMap<User, UserResponse>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

            // map user to userdataresponse
            CreateMap<User, UserDataResponse>()
                .ForMember(dest => dest.Boards, opt => opt.MapFrom(src => src.BoardUsers.Select(bu => bu.Board)));

            // map taskmodel to taskresponse
            CreateMap<TaskModel, TaskResponse>()
                .ForMember(dest => dest.BoardName, opt => opt.MapFrom(src => src.Board!.Name))
                .ForMember(dest => dest.ColumnName, opt => opt.MapFrom(src => src.BoardColumn!.ColumnName))
                .ForMember(dest => dest.AssignedUser, opt => opt.MapFrom(src => src.AssignedUser != null ? new UserResponse 
                { 
                    Id = src.AssignedUser.Id,
                    FirstName = src.AssignedUser.FirstName,
                    LastName = src.AssignedUser.LastName,
                    Email = src.AssignedUser.Email
                } : null))
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

            // map taskrequest to taskmodel
            CreateMap<TaskRequest, TaskModel>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<Models.TaskStatus>(src.Status.ToString(), true)))
                .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => Enum.Parse<TaskPriority>(src.Priority.ToString(), true)));

            // map taskcommentrequest to taskcomment
            CreateMap<TaskCommentRequest, TaskComment>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.TaskId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore());

            // map taskcomment to taskcommentresponse
            CreateMap<TaskComment, TaskCommentResponse>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));

            // map taskmodel to taskresponse (duplicated in original, keeping the relevant parts)
            CreateMap<TaskModel, TaskResponse>()
                .ForMember(dest => dest.BoardName, opt => opt.MapFrom(src => src.Board!.Name))
                .ForMember(dest => dest.ColumnName, opt => opt.MapFrom(src => src.BoardColumn!.ColumnName))
                .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments));

            // map taskcomment to taskcommentresponse (duplicated, merged into one)
            CreateMap<TaskComment, TaskCommentResponse>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"));
        }
    }
}
