using System.Runtime.ConstrainedExecution;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace backend.DTOs.Orders
{
    public class CreateOrderDto
    {
        // TODO: modificare per accettare un ShippingAddressId(o i dati dell'indirizzo)
        public List<CreateOrderDetailDto> Items { get; set; } = new();
    }

    public class CreateOrderDetailDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
