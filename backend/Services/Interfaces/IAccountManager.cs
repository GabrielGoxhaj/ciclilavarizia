using backend.DTOs.Customers;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface IAccountManager
    {
        Task<ApiResponse<string>> RegisterUserAsync(CustomerRegistrationDto dto);
    }
}