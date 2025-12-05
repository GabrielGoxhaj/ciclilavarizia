namespace backend.DTOs
{
    public class CustomersDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
