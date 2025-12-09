using backend.DTOs.Orders;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            try
            {
               var created = await _orderService.CreateOrderAsync(dto);
               return Ok(created);
            }
            catch (Exception ex)
            {
               return StatusCode(500, new { message = ex.Message});
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid order ID" });
            }
            var order = await _orderService.GetOrderByIdAsync(id);
            return order == null ? NotFound() : Ok(order);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            if (customerId <= 0)
            {
                return BadRequest(new { message = "Invalid customer ID" });
            }

            var orders = await _orderService.GetOrdersByCustomerIdAsync(customerId);
            return Ok(orders);
        }
    }
}
