using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Customers
{
    public class CustomerCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }
        [Phone]
        [MaxLength(25)]
        public string? Phone { get; set; }
        public string Password { get; set; } = string.Empty;
    }
}
