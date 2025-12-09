using backend.Data;
using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _service;

        public CustomersController(ICustomerService service)
        {
            _service = service;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<IActionResult> GetCustomers(int page = 1, int pageSize = 20)
        {
            var response = await _service.GetAllCustomersAsync(page, pageSize);

            return Ok(response);
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var response = await _service.GetCustomerByIdAsync(id);

            return Ok(response);
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> PostCustomer(CustomerCreateDto dto)
        {
            try
            {
                var response = await _service.CreateCustomerAsync(dto);

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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult> PutCustomer(int id, CustomerUpdateDto dto)
        {
            try
            {
                var response = await _service.UpdateCustomerAsync(id, dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error(ex.Message));
            }
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var response = await _service.DeleteCustomerAsync(id);

            return Ok(response);
        }
    }
}
