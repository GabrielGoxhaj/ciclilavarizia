using backend.Data;
using backend.DTOs.Customers;
using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AdventureWorksLt2019Context _context;

        public ProductsController(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetProducts(int page = 1, int size = 20)
        {
            var totalItems = await _context.Products.CountAsync();

            var totalPages = (int)Math.Ceiling(totalItems / (double)size);

            var products = await _context.Products
                .OrderBy(c => c.ProductId)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    Color = p.Color,
                    ListPrice = p.ListPrice,
                    Size = p.Size,
                    Weight = p.Weight,
                    ProductCategoryId = p.ProductCategoryId
                }
                )
                .ToListAsync();

            var pagination = new PaginationDto
            {
                Page = page,
                PageSize = size,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return Ok(ApiResponse<List<ProductDto>>.Success(products, "Products retrieved", pagination));
        }
            // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid product ID"));
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(ApiResponse<string>.Fail("Product not found"));
            }

            var dto = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                ProductNumber = product.ProductNumber,
                Color = product.Color,
                ListPrice = product.ListPrice,
                Size = product.Size,
                Weight = product.Weight,
                ProductCategoryId = product.ProductCategoryId
            };

            return Ok(ApiResponse<ProductDto>.Success(dto, "Product retrieved"));

        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductUpdateDto dto)
        {

            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid product ID"));
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(ApiResponse<string>.Fail("Product not found"));
            }

            // Update only the fields that are provided in the DTO
            if (dto.Name != null)
                product.Name = dto.Name;
            if (dto.ProductNumber != null)
                product.ProductNumber = dto.ProductNumber;
            if (dto.Color != null)
                product.Color = dto.Color;
            if (dto.ListPrice.HasValue)
                product.ListPrice = dto.ListPrice.Value;
            if (dto.Size != null)
                product.Size = dto.Size;
            if (dto.Weight.HasValue)
                product.Weight = dto.Weight.Value;
            if (dto.ProductCategoryId.HasValue)
                product.ProductCategoryId = dto.ProductCategoryId.Value;
            if (dto.ProductModelId.HasValue)
                product.ProductModelId = dto.ProductModelId.Value;
            product.ModifiedDate = DateTime.UtcNow;



            return Ok(ApiResponse<string>.Success("Product updated successfully"));
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductCreateDto>>> PostProduct(ProductCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.Fail("Invalid data provided"));

            var product = new Product
            {
                Name = dto.Name,
                ProductNumber = dto.ProductNumber,
                Color = dto.Color,
                Size = dto.Size,
                Weight = dto.Weight,
                ListPrice = dto.ListPrice,
                ProductCategoryId = dto.ProductCategoryId,
                ModifiedDate = DateTime.Now
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var outputDto = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                ProductNumber = product.ProductNumber,
                Color = product.Color,
                Size = product.Size,
                Weight = product.Weight,
                ListPrice = product.ListPrice,
                ProductCategoryId = product.ProductCategoryId
            };

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = product.ProductId },
                ApiResponse<ProductDto>.Success(outputDto, "Product created")
            );
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid product ID"));
            }

            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(ApiResponse<string>.Fail("Products not found"));
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(ApiResponse<string>.Success("Customer deleted"));
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
