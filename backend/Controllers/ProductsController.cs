using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Services.Interfaces;
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
        [HttpGet]
        public async Task<ActionResult> GetAllProducts(int page = 1, int size = 20)
        {
            var response = await _service.GetAllProductsAsync(page, size);

            return Ok(response);
        }

        // GET: api/Products/5
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

    }
}
