using backend.DTOs.Customers;
using backend.Models;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    FullName = $"{c.FirstName} {c.LastName}",
                    Email = c.EmailAddress,
                    Phone = c.Phone
                })
                .Take(20)
                .ToListAsync();

            return Ok(customers);
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return Ok(customerDto);
        }

        // PUT: api/Customers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            if (dto.FirstName != null) customer.FirstName = dto.FirstName;
            if (dto.LastName != null) customer.LastName = dto.LastName;
            if (dto.Email != null) customer.EmailAddress = dto.Email;
            if (dto.Phone != null) customer.Phone = dto.Phone;

            customer.ModifiedDate = DateTime.Now;

            _context.SaveChanges();

            return NoContent();
        }

        // POST: api/Customers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(CustomerCreateDto dto)
        {
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

            return CreatedAtAction("GetCustomer", new { id = customer.CustomerId }, dto);
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }
    }
}
