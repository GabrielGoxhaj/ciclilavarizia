namespace backend.DTOs.Products
{
    public class ProductListItemDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ProductNumber { get; set; } = string.Empty;
        public decimal ListPrice { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } // disponibilità del prodotto, calcolata nel service
        public string? Description { get; set; }
    }
}
