using backend.DTOs.Products;
using backend.DTOs.Response;

namespace backend.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<ApiResponse<List<ProductCategoryDto>>> GetAllCategoriesAsync();
    }
}
