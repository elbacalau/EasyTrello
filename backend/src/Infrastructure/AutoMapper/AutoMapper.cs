using AutoMapper;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.BoardDTOs;
using backend.src.DTOs.TaskDTOs;
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