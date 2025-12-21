using backend.DTOs.Orders;

namespace backend.Services.Interfaces
{
    public interface IOrderQueryService 
    {
        // USER
        Task<List<OrderDto>> GetMyOrdersAsync(int customerId);
        Task<OrderDto?> GetMyOrderByIdAsync(int orderId, int customerId);

        // ADMIN
        Task<List<OrderDto>> GetOrdersByCustomerIdAsync(int customerId);
        Task<List<OrderDto>> GetAllOrdersAsync();
    }
}
