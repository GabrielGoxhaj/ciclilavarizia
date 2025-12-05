using backend.DTOs.Customers;
using backend.DTOs.Response;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly AdventureWorksLt2019Context _context;

        public CustomersController(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CustomerDto>>>> GetCustomers(int page = 1, int size = 20)
        {
            var query = _context.Customers;

            var totalItems = await query.CountAsync();

            var totalPages = (int)Math.Ceiling(totalItems / (double)size);

            var customers = await _context.Customers
                .OrderBy(c => c.CustomerId)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    FullName = $"{c.FirstName} {c.LastName}",
                    Email = c.EmailAddress,
                    Phone = c.Phone
                })
                .ToListAsync();

            var pagination = new PaginationDto
            {
                Page = page,
                PageSize = size,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return Ok(ApiResponse<List<CustomerDto>>.Success(customers, "Customers retrieved", pagination));
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> GetCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(ApiResponse<string>.Fail("Customer not found"));
            }

            var dto = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return Ok(ApiResponse<CustomerDto>.Success(dto, "Customer retrieved"));
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> PutCustomer(int id, CustomerUpdateDto dto)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID") );
            }

            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(ApiResponse<string>.Fail("Customer not found"));
            }

            if (dto.FirstName == null && dto.LastName == null && dto.Email == null && dto.Phone == null)
                return BadRequest(ApiResponse<string>.Fail("No fields to update"));

            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var emailExists = await _context.Customers
                    .AnyAsync(c => c.EmailAddress == dto.Email && c.CustomerId != id);

                if (emailExists)
                    return Conflict(ApiResponse<string>.Fail("Email is already in use by another customer"));
            }

            if (dto.FirstName != null) customer.FirstName = dto.FirstName;
            if (dto.LastName != null) customer.LastName = dto.LastName;
            if (dto.Email != null) customer.EmailAddress = dto.Email;
            if (dto.Phone != null) customer.Phone = dto.Phone;

            customer.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();

            var outputDto = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return Ok(ApiResponse<CustomerDto>.Success(outputDto, "Customer updated"));
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> PostCustomer(CustomerCreateDto dto)
        {
            var emailExists = await _context.Customers
                .AnyAsync(c => c.EmailAddress == dto.Email);

            if (emailExists)
                return Conflict(ApiResponse<string>.Fail("Email is already registered"));

            var customer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailAddress = dto.Email,
                Phone = dto.Phone,
                //PasswordHash = HashPassword(customer.Password),
                //PasswordSalt = GenerateSalt(),
                ModifiedDate = DateTime.Now
            };

            _context.Customers.Add(customer);

            await _context.SaveChangesAsync();

            var outputDto = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return CreatedAtAction(
                    nameof(GetCustomer),
                    new { id = customer.CustomerId },
                    ApiResponse<CustomerDto>.Success(outputDto, "Customer created")
                   );
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid customer ID"));
            }

            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(ApiResponse<string>.Fail("Customer Not Found"));
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.Success("Customer deleted"));
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }
    }
}
