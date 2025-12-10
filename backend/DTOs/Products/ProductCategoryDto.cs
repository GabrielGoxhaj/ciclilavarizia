namespace backend.DTOs.Products
{
    public class ProductCategoryDto
    {
        public int ProductCategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentProductCategoryId { get; set; }
    }
}
