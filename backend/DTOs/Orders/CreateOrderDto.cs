using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Orders
{
    public class CreateOrderDto
    {
        [Required]
        public int AddressId { get; set; }
        public List<CreateOrderDetailDto> Items { get; set; } = new();
    }

    public class CreateOrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
