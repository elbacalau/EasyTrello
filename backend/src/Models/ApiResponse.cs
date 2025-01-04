namespace backend.src.Models
{
    public class ApiResponse<T>
    {
        public string? Result { get; set; }
        public T? Detail { get; set; }
    }

    public class ErrorResponse
    {
        public string? Message { get; set; }
        public string? Code { get; set; }
    }

}
