using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Auth
{
    public class UpdateProfileDto
    {
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Username { get; set; } = string.Empty;
        [Phone]
        [MaxLength(25)]
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
    }
}
