using AutoMapper;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.BoardDTOs;
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
            CreateMap<TaskModel, TaskResponse>();
            CreateMap<User, UserResponse>();
        }
    }
}