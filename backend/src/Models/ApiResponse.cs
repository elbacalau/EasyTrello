namespace backend.src.Models
{
    public class ApiResponse<T>
    {
        public required string Result { get; set; }
        public required T Detail { get; set; }
    }

    public class ErrorResponse
    {
        public string? Message { get; set; }
        public string? Code { get; set; }
    }

}
