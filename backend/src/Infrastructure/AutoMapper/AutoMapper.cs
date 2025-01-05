using AutoMapper;
using backend.Models;
using backend.src.DTOs;
using backend.src.DTOs.BoardDTOs;
using backend.src.DTOs.TaskDTOs;
using backend.src.Models.backend.src.Models;

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
            CreateMap<Board, BoardResponse>().ForMember(dest => dest.AssignedUser, opt => opt.MapFrom(src => src.AssignedUser));
            CreateMap<Task, TaskResponse>();
            CreateMap<User, UserResponse>();
        }
    }
}