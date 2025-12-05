namespace backend.DTOs.Customers
{
    public class CustomerCreateDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
