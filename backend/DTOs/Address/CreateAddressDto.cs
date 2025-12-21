using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Address
{
    public class CreateAddressDto
    {
        public string AddressType { get; set; } = "Shipping";

        [Required]
        public string? AddressLine1 { get; set; }

        [Required]
        public string? City { get; set; }

        public string? StateProvince { get; set; }
        [Required]
        public string? CountryRegion { get; set; }
        [Required]
        public string? PostalCode { get; set; }
    }
}
