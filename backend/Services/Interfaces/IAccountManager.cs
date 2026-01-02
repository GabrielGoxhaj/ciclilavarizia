using backend.DTOs.Auth;
using backend.DTOs.Customers;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface IAccountManager
    {
        Task<ApiResponse<string>> RegisterUserAsync(CustomerRegistrationDto dto);
        Task<ApiResponse<string>> UpdateUserProfileAsync(int securityUserId, UpdateProfileDto dto);
        Task<ApiResponse<string>> ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}