using backend.Data;
using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using System.Drawing;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        public readonly AdventureWorksLt2019Context _context;
        public ProductService(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync(int page = 1, int pageSize = 20)
        {
            var totalItems = await _context.Products.CountAsync();

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await _context.Products
                .OrderBy(c => c.ProductId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return ApiResponse<List<ProductDto>>.Success(products, "Products retrieved", pagination);
        }
        public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return ApiResponse<ProductDto>.Fail("Product not found");
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
            return ApiResponse<ProductDto>.Success(dto, "Product retrieved");
        }
        public async Task<ApiResponse<ProductDto>> CreateProductAsync(ProductCreateDto dto)
        {

            if (string.IsNullOrWhiteSpace(dto.Name))
                return ApiResponse<ProductDto>.Fail("Name is required.");

            var product = new Product
            {
                Name = dto.Name,
                ProductNumber = dto.ProductNumber,
                Color = dto.Color,
                Size = dto.Size,
                Weight = dto.Weight,
                ListPrice = dto.ListPrice,
                ProductCategoryId = dto.ProductCategoryId,
                ProductModelId = dto.ProductModelId,
                ModifiedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var result = new ProductDto
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

            return ApiResponse<ProductDto>.Success(result, "Product created");
        }
        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return ApiResponse<ProductDto>.Fail("Product not found");

            if (dto.ListPrice <= 0)
                return ApiResponse<ProductDto>.Fail("List price must be greater than zero.");

            if (dto.Name != null) product.Name = dto.Name;
            if (dto.ProductNumber != null) product.ProductNumber = dto.ProductNumber;
            if (dto.Color != null) product.Color = dto.Color;
            if (dto.ListPrice.HasValue) product.ListPrice = dto.ListPrice.Value;
            if (dto.Size != null) product.Size = dto.Size;
            if (dto.Weight.HasValue) product.Weight = dto.Weight.Value;
            if (dto.ProductCategoryId.HasValue) product.ProductCategoryId = dto.ProductCategoryId.Value;
            if (dto.ProductModelId.HasValue) product.ProductModelId = dto.ProductModelId.Value;

            product.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new ProductDto
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

            return ApiResponse<ProductDto>.Success(result, "Product updated");
        }
        public async Task<ApiResponse<string>> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return ApiResponse<string>.Fail("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.Success("Product deleted");
        }
    }
}
