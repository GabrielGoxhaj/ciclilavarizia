using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Services;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductsController(IProductService service)
        {
            _service = service;
        }

        // GET: api/Products
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetAllProducts(int page = 1, int size = 20)
        {
            var response = await _service.GetAllProductsAsync(page, size);

            return Ok(response);
        }

        // GET: api/Products/5
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest(ApiResponse<string>.Fail("Invalid product ID"));
            }

            var response = await _service.GetProductByIdAsync(id);

            return Ok(response);

        }

        // POST: api/Products
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductCreateDto>>> PostProduct(ProductCreateDto dto)
        {
            try
            {
                if (dto == null)
                {
                    return BadRequest(ApiResponse<string>.Fail("Product data cannot be null"));
                }

                var response = await _service.CreateProductAsync(dto);
                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error("An error occurred while creating the product."));
            }
        }

        // PUT: api/Products/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> PutProduct(int id, ProductUpdateDto dto)
        {
            try 
            {
                var response = await _service.UpdateProductAsync(id, dto);

                if (response.Data == null)
                { 
                    return NotFound(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error("An error occurred while updating the product."));
            }
        }

        // DELETE: api/Products/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteProduct(int id)
        {
            try
            {
                var response = await _service.DeleteProductAsync(id);

                if (response.Status == "failure")
                    return NotFound(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<string>.Error(ex.Message));
            }
        }

        [HttpGet("catalog")]
        public async Task<ActionResult<ApiResponse<ProductCatalogDto>>> GetCatalog()
        {
            var respone = await _service.GetCatalogAsync();
            return Ok(respone);
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<List</*ProductDto*/ ProductListItemDto>>>> GetFilteredProducts(
            string? search,
            int? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            string? color,
            string? size,
            string? sort,
            int page = 1,
            int pageSize = 20)
        {
            var response = await _service.GetFilteredProductsAsync(search, categoryId, minPrice, maxPrice, color, size, sort, page, pageSize);
            return Ok(response);
        }

    }
}
