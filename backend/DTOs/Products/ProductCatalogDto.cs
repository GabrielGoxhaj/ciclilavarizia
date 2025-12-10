namespace backend.DTOs.Products
{
    public class ProductCatalogDto
    {
        public List<ProductDto> Products { get; set; } = new();
        public List<ProductCategoryDto> Categories { get; set; } = new();
        public List<ProductModelDto> Models { get; set; } = new();
        public List<ProductDescriptionDto> Descriptions { get; set; } = new();
    }
}
