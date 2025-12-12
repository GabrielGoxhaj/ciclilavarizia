using backend.DTOs.Orders;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {

        private readonly IOrderCommandService _commandService;
        private readonly IOrderQueryService _queryService;

        public OrdersController(
            IOrderCommandService commandService,
            IOrderQueryService queryService)
        {
            _commandService = commandService;
            _queryService = queryService;
        }

        // CREATE ORDER (USER)
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            var userId = GetUserId();
            var order = await _commandService.CreateOrderAsync(dto, userId);
            return Ok(order);
        }

        // GET MY ORDERS (USER)
        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            var orders = await _queryService.GetMyOrdersAsync(userId);
            return Ok(orders);
        }

        // GET MY ORDER BY ID (USER)
        [Authorize]
        [HttpGet("my/{orderId}")]
        public async Task<IActionResult> GetMyOrderById(int orderId)
        {
            var userId = GetUserId();
            var order = await _queryService.GetMyOrderByIdAsync(userId, orderId);

            if (order == null)
                return NotFound("Order not found");

            return Ok(order);
        }

        // ADMIN: GET ALL ORDERS
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _queryService.GetAllOrdersAsync();
            return Ok(orders);
        }

        // ADMIN: GET ORDERS BY CUSTOMER
        [Authorize(Roles = "Admin")]
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            var orders = await _queryService.GetOrdersByCustomerIdAsync(customerId);
            return Ok(orders);
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
