using backend.Data;
using backend.DTOs.Address;
using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // GET: api/Customers
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetCustomers(int page = 1, int pageSize = 20)
        {
            var response = await _customerService.GetAllCustomersAsync(page, pageSize);

            return Ok(response);
        }

        // GET: api/Customers/5
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var response = await _customerService.GetCustomerByIdAsync(id);

            return Ok(response);
        }

        // POST: api/Customers
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> PostCustomer(CustomerCreateDto dto)
        {
            try
            {
                var response = await _customerService.CreateCustomerAsync(dto);

                if (response == null)
                {
                    return BadRequest(ApiResponse<string>.Fail("Failed to create customer"));
                }

                return CreatedAtAction(
                     nameof(GetCustomer),
                     new { id = response.Data.CustomerId },
                     response
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error(ex.Message));
            }

        }

        // PUT: api/Customers/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> PutCustomer(int id, CustomerUpdateDto dto)
        {
            try
            {
                var response = await _customerService.UpdateCustomerAsync(id, dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error(ex.Message));
            }
        }

        // DELETE: api/Customers/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var response = await _customerService.DeleteCustomerAsync(id);

            return Ok(response);
        }

        [Authorize]
        [HttpPost("addresses")]
        public async Task<ActionResult<ApiResponse<AddressDto>>> AddAddress([FromBody] CreateAddressDto dto)
        {
            try
            {
                var securityUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(securityUserId);

                var newAddress = await _customerService.AddAddressAsync(customerId, dto);

                return Ok(ApiResponse<AddressDto>.Success(newAddress, "Address added successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }

        [Authorize]
        [HttpGet("my-addresses")]
        public async Task<ActionResult<ApiResponse<List<AddressDto>>>> GetMyAddresses()
        {
            try
            {
                var securityUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

                var customerId = await _customerService.GetCustomerIdBySecurityIdAsync(securityUserId);

                var addresses = await _customerService.GetAddressesByCustomerIdAsync(customerId);

                return Ok(ApiResponse<List<AddressDto>>.Success(addresses, "Addresses retrieved successfully"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
        }
    }
}
