namespace backend.DTOs.Orders
{
    public class CreateOrderDto
    {
        public int CustomerId { get; set; }
        public List<CreateOrderDetailDto> Items { get; set; } = new();
    }

    public class CreateOrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
