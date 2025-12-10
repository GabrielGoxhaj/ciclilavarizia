using backend.Data;
using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class CategoryService : ICategoryService
    {
        public readonly AdventureWorksLt2019Context _context;
        public CategoryService(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        // Implementazione dei metodi dell'interfaccia ICategoryService
        public async Task<ApiResponse<List<ProductCategoryDto>>> GetAllCategoriesAsync()
        {
            var categories = await _context.ProductCategories
                .OrderBy(c => c.Name)
                .Select(c => new ProductCategoryDto
                {
                    ProductCategoryId = c.ProductCategoryId,
                    Name = c.Name,
                    ParentProductCategoryId = c.ParentProductCategoryId
                })
                .ToListAsync();

            return ApiResponse<List<ProductCategoryDto>>.Success(categories, "Categories retrieved");
        }
    }
}
