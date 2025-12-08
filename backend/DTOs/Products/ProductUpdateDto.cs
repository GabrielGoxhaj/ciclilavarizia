namespace backend.DTOs.Products
{
    public class ProductUpdateDto
    {
        public string? Name { get; set; }
        public string? ProductNumber { get; set; }
        public string? Color { get; set; }
        public decimal? ListPrice { get; set; }
        public string? Size { get; set; }
        public decimal? Weight { get; set; }

        public int? ProductCategoryId { get; set; }
        public int? ProductModelId { get; set; }
    }
}
