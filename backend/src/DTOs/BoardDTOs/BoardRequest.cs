namespace backend.src.DTOs.BoardDTOs
{
    public class BoardRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; } 
        public string? Visibility { get; set; } 

    }
}