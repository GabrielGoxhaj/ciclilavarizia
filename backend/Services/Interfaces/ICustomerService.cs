using backend.DTOs.Customers;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<ApiResponse<List<CustomerDto>>> GetAllCustomersAsync(int page, int size);
        Task<ApiResponse<CustomerDto>> GetCustomerByIdAsync(int id);
        Task<ApiResponse<CustomerDto>> CreateCustomerAsync(CustomerCreateDto dto);
        Task<ApiResponse<CustomerDto>> UpdateCustomerAsync(int id, CustomerUpdateDto dto);
        Task<ApiResponse<string>> DeleteCustomerAsync(int id);
    }
}
