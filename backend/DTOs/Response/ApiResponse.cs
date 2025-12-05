namespace backend.DTOs.Response
{
    public class ApiResponse<T>
    {
        public string Status { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public PaginationDto? Pagination { get; set; }

        public ApiResponse(string status, T? data = default, string? message = null, PaginationDto? pagination = null)
        {
            Status = status;
            Message = message;
            Data = data;
            Pagination = pagination;
        }

        public static ApiResponse<T> Success(T data, string? message = null, PaginationDto? pagination = null)
        {
            return new ApiResponse<T>("success", data, message, pagination);
        }

        public static ApiResponse<T> Fail(string message)
        {
            return new ApiResponse<T>("failure", default, message);
        }

        public static ApiResponse<T> Error(string message)
        {
            return new ApiResponse<T>("error", default, message);
        }
    }
}
