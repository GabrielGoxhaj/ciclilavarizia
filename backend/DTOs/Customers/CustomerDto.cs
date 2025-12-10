using backend.DTOs.Address;
using backend.DTOs.Orders;

namespace backend.DTOs.Customers
{
    public class CustomerDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public List<AddressDto> Addresses { get; set; } = new();
        public List<OrderDto> Orders { get; set; } = new();
    }
}
