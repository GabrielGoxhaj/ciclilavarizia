using backend.DTOs.Orders;

namespace backend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto);
        Task<OrderDto?> GetOrderByIdAsync(int orderId);
        Task<List<OrderDto>> GetOrdersByCustomerIdAsync(int customerId);
    }
}
