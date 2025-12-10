namespace backend.DTOs.Products
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public string? ProductNumber { get; set; }
        public string? Color { get; set; }
        public decimal ListPrice { get; set; }
        public string? Size { get; set; }
        public decimal? Weight { get; set; }
        public int? ProductCategoryId { get; set; }
        public ProductCategoryDto? Category { get; set; }
        public int? ProductModelId { get; set; }
        public ProductModelDto? Model { get; set; }

        public ProductDescriptionDto? Description { get; set; }
    }
}
