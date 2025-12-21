using backend.DTOs.Orders;

namespace backend.Services.Interfaces
{
    public interface IOrderCommandService
    {
        Task<OrderDto> CreateOrderAsync(CreateOrderDto createOrderDto, int customerId);
    }
}
