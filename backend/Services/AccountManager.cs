using backend.DTOs.Auth;
using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Services.Interfaces;
using System.Transactions;

namespace backend.Services
{
    public class AccountManager : IAccountManager
    {
        private readonly ICustomerService _customerService;
        private readonly IAuthService _authService;

        public AccountManager(ICustomerService customerService, IAuthService authService)
        {
            _customerService = customerService;
            _authService = authService;
        }

        public async Task<ApiResponse<string>> RegisterUserAsync(CustomerRegistrationDto dto)
        {
            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    int newSecurityUserId = await _authService.CreateCredentialsAsync(dto);

                    await _customerService.CreateOrUpdateCustomerProfileAsync(dto, newSecurityUserId);

                    scope.Complete();
                    return ApiResponse<string>.Success("Registration completed");
                }
                catch (Exception ex)
                {
                    return ApiResponse<string>.Fail(ex.Message);
                }
            }
        }

        public async Task<ApiResponse<string>> UpdateUserProfileAsync(int securityUserId, UpdateProfileDto dto)
        {
            using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    await _authService.UpdateLoginCredentialsAsync(securityUserId, dto.Email, dto.Username);

                    await _customerService.UpdateCustomerDetailsAsync(
                        securityUserId,  
                        dto.FirstName,
                        dto.LastName,
                        dto.Email,
                        dto.Phone,
                        dto.CompanyName
                    );

                    scope.Complete();
                    return ApiResponse<string>.Success("Profile updated successfully");
                }
                catch (Exception ex)
                {
                    return ApiResponse<string>.Fail(ex.Message);
                }
            }
        }

        public async Task<ApiResponse<string>> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmNewPassword)
                return ApiResponse<string>.Fail("New passwords do not match.");

            try
            {
                var success = await _authService.ChangePasswordAsync(userId, dto.OldPassword, dto.NewPassword);
                if (!success) return ApiResponse<string>.Fail("Incorrect old password.");

                return ApiResponse<string>.Success("Password changed successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<string>.Fail(ex.Message);
            }
        }

        // TODO : eliminazione customer da entrambi i db.

    }
}
