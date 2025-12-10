using backend.Data;
using backend.DTOs.Address;
using backend.DTOs.Customers;
using backend.DTOs.Orders;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Security.Policy;

namespace backend.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly AdventureWorksLt2019Context _context;
        public CustomerService(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<CustomerDto>>> GetAllCustomersAsync(int page, int pageSize)
        {
            var totalItems = await _context.Customers.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var customers = await _context.Customers
                   .Include(c => c.CustomerAddresses)
                      .ThenInclude(ca => ca.Address)
                   .OrderBy(c => c.CustomerId)
                   .Skip((page - 1) * pageSize)
                   .Take(pageSize)
                   .Select(c => new CustomerDto
                   {
                       CustomerId = c.CustomerId,
                       FullName = $"{c.FirstName} {c.LastName}",
                       Email = c.EmailAddress,
                       Phone = c.Phone,

                       Addresses = c.CustomerAddresses.Select(a => new AddressDto
                       {
                           AddressId = a.Address.AddressId,
                           AddressLine1 = a.Address.AddressLine1,
                           City = a.Address.City,
                           StateProvince = a.Address.StateProvince,
                           PostalCode = a.Address.PostalCode,
                           CountryRegion = a.Address.CountryRegion
                       }).ToList()
                   })
                   .ToListAsync();

            var pagination = new PaginationDto
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return ApiResponse<List<CustomerDto>>.Success(customers, "Customers retrieved", pagination);
        }

        public async Task<ApiResponse<CustomerDto>> GetCustomerByIdAsync(int id)
        {
            var customer = await _context.Customers
                  .Include(c => c.CustomerAddresses)
                     .ThenInclude(ca => ca.Address)
                  .Include(c => c.SalesOrderHeaders)
                     .ThenInclude(oh => oh.SalesOrderDetails)
                        .ThenInclude(od => od.Product)
                 .FirstOrDefaultAsync(c => c.CustomerId == id);

            if (customer == null)
                return ApiResponse<CustomerDto>.Fail("Customer not found");

            var dto = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone,

                Addresses = customer.CustomerAddresses.Select(a => new AddressDto
                {
                    AddressId = a.Address.AddressId,
                    AddressLine1 = a.Address.AddressLine1,
                    AddressLine2 = a.Address.AddressLine2,
                    City = a.Address.City,
                    StateProvince = a.Address.StateProvince,
                    PostalCode = a.Address.PostalCode,
                    CountryRegion = a.Address.CountryRegion
                }).ToList(),

                Orders = customer.SalesOrderHeaders.Select(o => new OrderDto
                {
                    SalesOrderId = o.SalesOrderId,
                    OrderDate = o.OrderDate,
                    SubTotal = o.SubTotal,
                    TaxAmt = o.TaxAmt,
                    Freight = o.Freight,
                    TotalDue = o.TotalDue,

                    OrderDetails = o.SalesOrderDetails.Select(od => new OrderDetailDto
                    {
                        ProductId = od.ProductId,
                        ProductName = od.Product.Name,
                        Quantity = od.OrderQty,
                        UnitPrice = od.UnitPrice,
                        LineTotal = od.LineTotal
                    }).ToList()

                }).ToList()
            };

            return ApiResponse<CustomerDto>.Success(dto, "Customer retrieved");
        }

        public async Task<ApiResponse<CustomerDto>> CreateCustomerAsync(CustomerCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FirstName))
                return ApiResponse<CustomerDto>.Fail("First name is required.");

            if (string.IsNullOrWhiteSpace(dto.Email))
                return ApiResponse<CustomerDto>.Fail("Email is required.");

            // Controllo email duplicata
            var emailExists = await _context.Customers
                .AnyAsync(c => c.EmailAddress == dto.Email);

            if (emailExists)
                return ApiResponse<CustomerDto>.Fail("Email is already registered.");
            var customer = new Customer
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailAddress = dto.Email,
                Phone = dto.Phone,
                //PasswordHash = HashPassword(customer.Password),
                //PasswordSalt = GenerateSalt(),
                ModifiedDate = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var result = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return ApiResponse<CustomerDto>.Success(result, "Customer created successfully");
        }

        public async Task<ApiResponse<CustomerDto>> UpdateCustomerAsync(int id, CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return ApiResponse<CustomerDto>.Fail("Customer not found");

            customer.FirstName = dto.FirstName;
            customer.LastName = dto.LastName;
            customer.EmailAddress = dto.Email;
            customer.Phone = dto.Phone;
            customer.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new CustomerDto
            {
                CustomerId = customer.CustomerId,
                FullName = $"{customer.FirstName} {customer.LastName}",
                Email = customer.EmailAddress,
                Phone = customer.Phone
            };

            return ApiResponse<CustomerDto>.Success(result, "Customer updated");
        }

        public async Task<ApiResponse<string>> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
                return ApiResponse<string>.Fail("Customer not found");

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.Success("Customer deleted successfully");
        }

    }
}
