using backend.DTOs.Auth;
using backend.DTOs.Customers;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface IAuthService
    {
        // Task<ApiResponse<string>> Register(UserRegisterDto dto);
        Task<bool> IsEmailAvailableAsync(string email);
        Task<int> CreateCredentialsAsync(CustomerRegistrationDto dto);
        Task<ApiResponse<AuthResponseDto>> Login(UserLoginDto dto);
        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        Task UpdateLoginCredentialsAsync(int userId, string newEmail, string newUsername);
    }
}
