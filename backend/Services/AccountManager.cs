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
                var securityDto = new UserRegisterDto
                {
                    Username = dto.Username,
                    Email = dto.Email!,
                    Password = dto.Password
                };

                int newSecurityUserId = await _authService.CreateCredentialsAsync(dto);
                await _customerService.CreateOrUpdateCustomerProfileAsync(dto, newSecurityUserId);
                //throw new Exception("debug");
                scope.Complete();
                return ApiResponse<string>.Success("Registration completed");
            }
        }

        // TODO : eliminazione customer da entrambi i db.

    }
}
