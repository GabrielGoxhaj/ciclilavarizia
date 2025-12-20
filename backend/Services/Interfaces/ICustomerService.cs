using backend.DTOs.Address;
using backend.DTOs.Customers;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<ApiResponse<List<CustomerDto>>> GetAllCustomersAsync(int page, int size);
        Task<ApiResponse<CustomerDto>> GetCustomerByIdAsync(int id);
        Task<ApiResponse<CustomerDto>> CreateCustomerAsync(CustomerCreateDto dto);
        Task CreateOrUpdateCustomerProfileAsync(CustomerRegistrationDto dto, int securityUserId);
        Task<ApiResponse<CustomerDto>> UpdateCustomerAsync(int id, CustomerUpdateDto dto);
        Task<ApiResponse<string>> DeleteCustomerAsync(int id);
        Task<int> GetCustomerIdBySecurityIdAsync(int securityUserId);
        Task<AddressDto> AddAddressAsync(int customerId, CreateAddressDto dto);
        Task<List<AddressDto>> GetAddressesByCustomerIdAsync(int customerId);
    }
}
