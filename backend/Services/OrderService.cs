using backend.DTOs.Orders;
using backend.Services.Interfaces;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AdventureWorksLt2019Context _context;

        public OrderService(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
        {
            // Validazione DTO
            if (dto == null)
                throw new ArgumentException("Order data cannot be null.");

            if (dto.Items == null || dto.Items.Count == 0)
                throw new ArgumentException("The order must contain at least one item.");

            // Validazione cliente esistente
            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == dto.CustomerId);
            if(!customerExists)
                throw new Exception("Customer not found.");

            // Verifica che tutti i prodotti esistano
            var productIds = dto.Items.Select(i => i.ProductId).ToList();

            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToListAsync();

            if (products.Count != productIds.Count)
                throw new Exception("One or more products not found.");

            // Calcoli e creazione header 
            decimal subTotal = 0;

            var orderHeader = new SalesOrderHeader
            {
                CustomerId = dto.CustomerId,
                OrderDate = DateTime.UtcNow,
                Status = 1,
                ShipMethod = "DEFAULT",
                SubTotal = 0,
                TaxAmt = 0,
                Freight = 0,
                TotalDue = 0
            };

            _context.SalesOrderHeaders.Add(orderHeader);
            await _context.SaveChangesAsync();

            // Creazione dettagli ordine
            foreach (var item in dto.Items)
            {
                var product = products.First(p => p.ProductId == item.ProductId);
                var lineTotal = product.ListPrice * item.Quantity;
                subTotal += lineTotal;
                var orderDetail = new SalesOrderDetail
                {
                    SalesOrderId = orderHeader.SalesOrderId,
                    ProductId = product.ProductId,
                    OrderQty = (short)item.Quantity,
                    UnitPrice = product.ListPrice,
                    UnitPriceDiscount = 0,
                    LineTotal = lineTotal,
                    ModifiedDate = DateTime.UtcNow
                };
                _context.SalesOrderDetails.Add(orderDetail);

            }

            // Calcoli finali
            orderHeader.SubTotal = subTotal;
            orderHeader.TaxAmt = subTotal * 0.22m; // IVA 22%
            orderHeader.Freight = 5m; // fisso per esempio
            orderHeader.TotalDue = orderHeader.SubTotal + orderHeader.TaxAmt + orderHeader.Freight;

            await _context.SaveChangesAsync();

            // Restituzione ordine completo
            return await GetOrderByIdAsync(orderHeader.SalesOrderId)
                    ?? throw new Exception("Errore nel recupero dell'ordine creato.");

        }
        public async Task<OrderDto?> GetOrderByIdAsync(int orderId)
        {
            var order = await _context.SalesOrderHeaders
                .Include(o => o.SalesOrderDetails)
                .ThenInclude(d => d.Product)
                .FirstOrDefaultAsync(o => o.SalesOrderId == orderId);

            if (order == null) return null;

            return new OrderDto
            {
                SalesOrderId = order.SalesOrderId,
                CustomerId = order.CustomerId,
                OrderDate = order.OrderDate,
                SubTotal = order.SubTotal,
                TaxAmt = order.TaxAmt,
                Freight = order.Freight,
                TotalDue = order.TotalDue,
                OrdersDatails = order.SalesOrderDetails.Select(d => new OrderDetailDto
                {
                    ProductId = d.ProductId,
                    ProductName = d.Product.Name,
                    Quantity = d.OrderQty,
                    UnitPrice = d.UnitPrice,
                    Discount = d.UnitPriceDiscount,
                    LineTotal = d.LineTotal
                }).ToList()
            };

        }
        public async Task<List<OrderDto>> GetOrdersByCustomerIdAsync(int customerId)
        {
            var orders = await _context.SalesOrderHeaders
                .Include(o => o.SalesOrderDetails)
                .ThenInclude(d => d.Product)
                .Where(o => o.CustomerId == customerId)
                .ToListAsync();

            return orders.Select(o => new OrderDto
            {
                SalesOrderId = o.SalesOrderId,
                CustomerId = o.CustomerId,
                OrderDate = o.OrderDate,
                SubTotal = o.SubTotal,
                TaxAmt = o.TaxAmt,
                Freight = o.Freight,
                TotalDue = o.TotalDue,
                OrdersDatails = o.SalesOrderDetails.Select(d => new OrderDetailDto
                {
                    ProductId = d.ProductId,
                    ProductName = d.Product.Name,
                    Quantity = d.OrderQty,
                    UnitPrice = d.UnitPrice,
                    Discount = d.UnitPriceDiscount,
                    LineTotal = d.LineTotal
                }).ToList()

            }).ToList();
        }
    }
}
