using backend.DTOs.Address;
using backend.DTOs.Auth;     
using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly ICustomerService _customerService;

        public AccountController(IAccountManager accountManager, ICustomerService customerService)
        {
            _accountManager = accountManager;
            _customerService = customerService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> GetProfile()
        {
            var userId = GetUserId();
            var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(userId);
            var result = await _customerService.GetCustomerByIdAsync(customerId);

            if (result.Status != "success")
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userId = GetUserId();
            var result = await _accountManager.UpdateUserProfileAsync(userId, dto);

            if (result.Status == "success") return Ok(result); 
            return BadRequest(result);
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = GetUserId();
            var result = await _accountManager.ChangePasswordAsync(userId, dto);

            if (result.Status == "success") return Ok(result);
            return BadRequest(result);
        }

        // GET: api/account/addresses
        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = GetUserId();
            var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(userId);

            var addresses = await _customerService.GetAddressesByCustomerIdAsync(customerId);
            return Ok(ApiResponse<List<AddressDto>>.Success(addresses));
        }

        // POST: api/account/addresses
        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress([FromBody] CreateAddressDto dto)
        {
            var userId = GetUserId();
            var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(userId);

            try
            {
                var newAddress = await _customerService.AddAddressAsync(customerId, dto);
                return Ok(ApiResponse<AddressDto>.Success(newAddress, "Address added successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }

        // PUT: api/account/addresses/{id}
        [HttpPut("addresses/{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] AddressDto dto)
        {
            var userId = GetUserId();
            var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(userId);

            try
            {
                var updatedAddress = await _customerService.UpdateAddressAsync(customerId, id, dto);
                return Ok(ApiResponse<AddressDto>.Success(updatedAddress, "Address updated successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }

        // DELETE: api/account/addresses/{id}
        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = GetUserId();
            var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(userId);

            try
            {
                await _customerService.DeleteAddressAsync(customerId, id);
                return Ok(ApiResponse<string>.Success("Address deleted successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }
        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}