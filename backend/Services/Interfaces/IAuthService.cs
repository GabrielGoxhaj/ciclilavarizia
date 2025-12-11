using backend.DTOs.Auth;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<string>> Register(UserRegisterDto dto);
        Task<ApiResponse<AuthResponseDto>> Login(UserLoginDto dto);
    }
}
