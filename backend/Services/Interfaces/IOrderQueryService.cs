using backend.DTOs.Orders;

namespace backend.Services.Interfaces
{
    public interface IOrderQueryService 
    {
        // USER
        Task<List<OrderDto>> GetMyOrdersAsync(int userId);
        Task<OrderDto?> GetMyOrderByIdAsync(int orderId, int userId);

        // ADMIN
        Task<List<OrderDto>> GetOrdersByCustomerIdAsync(int customerId);
        Task<List<OrderDto>> GetAllOrdersAsync();
    }
}
