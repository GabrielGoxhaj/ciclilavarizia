using backend.DTOs.Address;

namespace backend.DTOs.Customers
{
    public class CustomerRegistrationDto : CustomerCreateDto
    {
        public string Username { get; set; } = string.Empty;
        public List<CreateAddressDto>? Addresses { get; set; } = new();
    }
}
