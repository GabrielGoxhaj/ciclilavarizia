using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Customers
{
    public class CustomerUpdateDto
    {
        // fare le validazioni con annotation 
        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string? Email { get; set; }

        [Phone]
        [MaxLength(20)]
        public string? Phone { get; set; }
    }
}
