using backend.DTOs.Products;
using backend.DTOs.Response;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync(int page, int size);
        Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id);
        Task<ApiResponse<ProductDto>> CreateProductAsync(ProductCreateDto dto);
        Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, ProductUpdateDto dto);
        Task<ApiResponse<string>> DeleteProductAsync(int id);
        Task<ApiResponse<ProductCatalogDto>> GetCatalogAsync();

        // old
        //Task<ApiResponse<List<ProductDto>>> GetFilteredProductsAsync(string? search,
        //     int? categoryId,
        //     decimal? minPrice,
        //     decimal? maxPrice,
        //     string? color,
        //     string? size,
        //     string? sort,
        //     int page,
        //     int pageSize);

        Task<ApiResponse<List<ProductListItemDto>>> GetFilteredProductsAsync(
            string? search,
            int? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            string? color,
            string? size,
            string? sort,
            int page,
            int pageSize);
    }
}
