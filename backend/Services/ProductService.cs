using backend.Data;
using backend.DTOs.Products;
using backend.DTOs.Response;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ProductService : IProductService
    {
        public readonly AdventureWorksLt2019Context _context;
        public ProductService(AdventureWorksLt2019Context context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<ProductDto>>> GetAllProductsAsync(int page = 1, int pageSize = 20)
        {
            var totalItems = await _context.Products.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductModel)
                    .ThenInclude(pm => pm.ProductModelProductDescriptions)
                        .ThenInclude(pmpd => pmpd.ProductDescription)
                .OrderBy(p => p.ProductId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    Color = p.Color,
                    ListPrice = p.ListPrice,
                    Size = p.Size,
                    Weight = p.Weight,

                    ProductCategoryId = p.ProductCategoryId,
                    Category = p.ProductCategory == null ? null : new ProductCategoryDto
                    {
                        ProductCategoryId = p.ProductCategory.ProductCategoryId,
                        Name = p.ProductCategory.Name,
                        ParentProductCategoryId = p.ProductCategory.ParentProductCategoryId
                    },

                    ProductModelId = p.ProductModelId,
                    Model = p.ProductModel == null ? null : new ProductModelDto
                    {
                        ProductModelId = p.ProductModel.ProductModelId,
                        Name = p.ProductModel.Name
                    },

                    ThumbnailUrl = p.ThumbnailPhotoFileName != null
                        ? $"/images/products/{p.ThumbnailPhotoFileName}"
                        : "/images/products/placehold.webp",

                    ThumbnailFileName = p.ThumbnailPhotoFileName,

                    // Step 1: selezioniamo SOLO l'ID della descrizione
                    Description = null // lo riempiamo dopo fuori dal LINQ
                })
                .ToListAsync();

            // Step 2: ora che i dati sono in memoria, possiamo mappare la descrizione
            foreach (var product in products)
            {
                var productEntity = await _context.Products
                    .Include(p => p.ProductModel)
                        .ThenInclude(pm => pm.ProductModelProductDescriptions)
                            .ThenInclude(pmpd => pmpd.ProductDescription)
                    .FirstAsync(p => p.ProductId == product.ProductId);

                product.Description = productEntity.ProductModel?
                    .ProductModelProductDescriptions
                    .Select(d => new ProductDescriptionDto
                    {
                        ProductDescriptionId = d.ProductDescription.ProductDescriptionId,
                        Description = d.ProductDescription.Description
                    })
                    .FirstOrDefault();
            }

            var pagination = new PaginationDto
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return ApiResponse<List<ProductDto>>.Success(products, "Products retrieved", pagination);
        }
        public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductModel)
                   .ThenInclude(pm => pm.ProductModelProductDescriptions)
                      .ThenInclude(pmpd => pmpd.ProductDescription)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                return ApiResponse<ProductDto>.Fail("Product not found");
            }

            var dto = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                ProductNumber = product.ProductNumber,
                Color = product.Color,
                ListPrice = product.ListPrice,
                Size = product.Size,
                Weight = product.Weight,
                ProductCategoryId = product.ProductCategoryId,
                Category = product.ProductCategory == null ? null : new ProductCategoryDto
                {
                    ProductCategoryId = product.ProductCategory.ProductCategoryId,
                    Name = product.ProductCategory.Name,
                    ParentProductCategoryId = product.ProductCategory.ParentProductCategoryId
                },
                ProductModelId = product.ProductModelId,
                Model = product.ProductModel == null ? null : new ProductModelDto
                {
                    ProductModelId = product.ProductModel.ProductModelId,
                    Name = product.ProductModel.Name
                },
                Description = product.ProductModel == null ? null : product.ProductModel.ProductModelProductDescriptions
                    .Select(d => new ProductDescriptionDto
                    {
                        ProductDescriptionId = d.ProductDescription.ProductDescriptionId,
                        Description = d.ProductDescription.Description
                    })
                    .FirstOrDefault(),
                ThumbnailUrl = product.ThumbnailPhotoFileName != null
                    ? $"/images/products/{product.ThumbnailPhotoFileName}" 
                    : "/images/products/placehold.webp",

                ThumbnailFileName = product.ThumbnailPhotoFileName
            };
            return ApiResponse<ProductDto>.Success(dto, "Product retrieved");
        }
        public async Task<ApiResponse<ProductDto>> CreateProductAsync(ProductCreateDto dto)
        {

            if (string.IsNullOrWhiteSpace(dto.Name))
                return ApiResponse<ProductDto>.Fail("Name is required.");

            var product = new Product
            {
                Name = dto.Name,
                ProductNumber = dto.ProductNumber,
                Color = dto.Color,
                Size = dto.Size,
                Weight = dto.Weight,
                ListPrice = dto.ListPrice,
                ProductCategoryId = dto.ProductCategoryId,
                ProductModelId = dto.ProductModelId,
                ModifiedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            var result = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                ProductNumber = product.ProductNumber,
                Color = product.Color,
                Size = product.Size,
                Weight = product.Weight,
                ListPrice = product.ListPrice,
                ProductCategoryId = product.ProductCategoryId
            };

            return ApiResponse<ProductDto>.Success(result, "Product created");
        }
        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, ProductUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return ApiResponse<ProductDto>.Fail("Product not found");

            if (dto.ListPrice <= 0)
                return ApiResponse<ProductDto>.Fail("List price must be greater than zero.");

            if (dto.Name != null) product.Name = dto.Name;
            if (dto.ProductNumber != null) product.ProductNumber = dto.ProductNumber;
            if (dto.Color != null) product.Color = dto.Color;
            if (dto.ListPrice.HasValue) product.ListPrice = dto.ListPrice.Value;
            if (dto.Size != null) product.Size = dto.Size;
            if (dto.Weight.HasValue) product.Weight = dto.Weight.Value;
            if (dto.ProductCategoryId.HasValue) product.ProductCategoryId = dto.ProductCategoryId.Value;
            if (dto.ProductModelId.HasValue) product.ProductModelId = dto.ProductModelId.Value;

            product.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var result = new ProductDto
            {
                ProductId = product.ProductId,
                Name = product.Name,
                ProductNumber = product.ProductNumber,
                Color = product.Color,
                ListPrice = product.ListPrice,
                Size = product.Size,
                Weight = product.Weight,
                ProductCategoryId = product.ProductCategoryId
            };

            return ApiResponse<ProductDto>.Success(result, "Product updated");
        }
        public async Task<ApiResponse<string>> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return ApiResponse<string>.Fail("Product not found");

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return ApiResponse<string>.Success("Product deleted");
        }


        public async Task<ApiResponse<ProductCatalogDto>> GetCatalogAsync()
        {
            // 1️⃣ Carichiamo TUTTE le descrizioni dei modelli in un'unica query
            var modelDescriptions = await _context.ProductModels
                .Include(pm => pm.ProductModelProductDescriptions)
                    .ThenInclude(pd => pd.ProductDescription)
                .ToDictionaryAsync(
                    pm => pm.ProductModelId,
                    pm => pm.ProductModelProductDescriptions
                        .Select(d => new ProductDescriptionDto
                        {
                            ProductDescriptionId = d.ProductDescription.ProductDescriptionId,
                            Description = d.ProductDescription.Description
                        })
                        .FirstOrDefault()
                );

            // 2️⃣ Carichiamo i prodotti (categoria + modello), senza descrizione
            var products = await _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductModel)
                .OrderBy(p => p.Name)
                .Select(p => new ProductDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    Color = p.Color,
                    ListPrice = p.ListPrice,
                    Size = p.Size,
                    Weight = p.Weight,

                    ProductCategoryId = p.ProductCategoryId,
                    Category = p.ProductCategory == null ? null : new ProductCategoryDto
                    {
                        ProductCategoryId = p.ProductCategory.ProductCategoryId,
                        Name = p.ProductCategory.Name,
                        ParentProductCategoryId = p.ProductCategory.ParentProductCategoryId
                    },

                    ProductModelId = p.ProductModelId,
                    Model = p.ProductModel == null ? null : new ProductModelDto
                    {
                        ProductModelId = p.ProductModel.ProductModelId,
                        Name = p.ProductModel.Name
                    },

                    ThumbnailUrl = p.ThumbnailPhotoFileName != null
                        ? $"/images/products/{p.ThumbnailPhotoFileName}"
                        : "/images/products/placehold.webp",

                    ThumbnailFileName = p.ThumbnailPhotoFileName,

                    Description = null // ⭐ viene aggiunta dopo
                })
                .ToListAsync();

            // 3️⃣ Assegniamo la descrizione ai prodotti IN MEMORIA (zero query)
            foreach (var product in products)
            {
                if (product.ProductModelId != null &&
                    modelDescriptions.TryGetValue(product.ProductModelId.Value, out var desc))
                {
                    product.Description = desc;
                }
            }

            // 4️⃣ Categorie
            var categories = await _context.ProductCategories
                .OrderBy(c => c.Name)
                .Select(c => new ProductCategoryDto
                {
                    ProductCategoryId = c.ProductCategoryId,
                    Name = c.Name,
                    ParentProductCategoryId = c.ParentProductCategoryId
                })
                .ToListAsync();

            // 5️⃣ Modelli
            var models = await _context.ProductModels
                .OrderBy(m => m.Name)
                .Select(m => new ProductModelDto
                {
                    ProductModelId = m.ProductModelId,
                    Name = m.Name
                })
                .ToListAsync();

            // 6️⃣ Descrizioni (opzionale, se vuoi mostrarle tutte)
            var descriptions = await _context.ProductDescriptions
                .Select(d => new ProductDescriptionDto
                {
                    ProductDescriptionId = d.ProductDescriptionId,
                    Description = d.Description
                })
                .ToListAsync();

            // 7️⃣ Costruzione del catalogo
            var catalog = new ProductCatalogDto
            {
                Products = products,
                Categories = categories,
                Models = models,
                Descriptions = descriptions
            };

            return ApiResponse<ProductCatalogDto>.Success(catalog, "Catalog loaded");
        }

        public async Task<ApiResponse<List<ProductDto>>> GetFilteredProductsAsync(
            string? search,
            int? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            string? color,
            string? size,
            string? sort,
            int page,
            int pageSize)
        {
            var query = _context.Products
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductModel)
                   .ThenInclude(pm => pm.ProductModelProductDescriptions)
                      .ThenInclude(pmpd => pmpd.ProductDescription)
                .AsQueryable();

            // Filtri
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(searchLower) ||
                    p.ProductNumber.ToLower().Contains(searchLower) ||
                    (p.ProductModel != null && p.ProductModel.Name.ToLower().Contains(searchLower)) ||
                    (p.ProductModel != null && p.ProductModel
                         .ProductModelProductDescriptions
                         .Any(d => d.ProductDescription.Description.ToLower().Contains(searchLower)))
    );
            }

            if (categoryId.HasValue)
                query = query.Where(p => p.ProductCategoryId == categoryId.Value);

            if (minPrice.HasValue)
                query = query.Where(p => p.ListPrice >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.ListPrice <= maxPrice.Value);

            if (!string.IsNullOrWhiteSpace(color))
            {
                var lowerColor = color.ToLower();
                query = query.Where(p =>
                    p.Color != null &&
                    p.Color.ToLower() == lowerColor
                );
            }

            if (!string.IsNullOrWhiteSpace(size))
            {
                var sizeLower = size.ToLower();
                query = query.Where(p =>
                    p.Size != null &&
                    p.Size.ToLower() == sizeLower
                );
            }

            // Sorting dinamico
            query = sort switch
            {
                "price_asc" => query.OrderBy(p => p.ListPrice),
                "price_desc" => query.OrderByDescending(p => p.ListPrice),
                "name_desc" => query.OrderByDescending(p => p.Name),
                "name_asc" => query.OrderBy(p => p.Name),
                _ => query.OrderBy(p => p.ProductId) // default
            };

            // Paginazione
            var totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var result = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Mapping finale in ProductDto
            var products = result.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name,
                ProductNumber = p.ProductNumber,
                Color = p.Color,
                ListPrice = p.ListPrice,
                Size = p.Size,
                Weight = p.Weight,

                ProductCategoryId = p.ProductCategoryId,
                Category = p.ProductCategory == null ? null : new ProductCategoryDto
                {
                    ProductCategoryId = p.ProductCategory.ProductCategoryId,
                    Name = p.ProductCategory.Name,
                    ParentProductCategoryId = p.ProductCategory.ParentProductCategoryId
                },

                ProductModelId = p.ProductModelId,
                Model = p.ProductModel == null ? null : new ProductModelDto
                {
                    ProductModelId = p.ProductModel.ProductModelId,
                    Name = p.ProductModel.Name
                },

                Description = p.ProductModel?
                    .ProductModelProductDescriptions?
                    .Select(d => new ProductDescriptionDto
                    {
                        ProductDescriptionId = d.ProductDescription.ProductDescriptionId,
                        Description = d.ProductDescription.Description
                    })
                    .FirstOrDefault(),

                ThumbnailUrl = p.ThumbnailPhotoFileName != null
                    ? $"/images/products/{p.ThumbnailPhotoFileName}" 
                    : "/images/products/placehold.webp",

                ThumbnailFileName = p.ThumbnailPhotoFileName
            })
            .ToList();

            // Restituzione con paginazione
            var pagination = new PaginationDto
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = totalPages
            };

            return ApiResponse<List<ProductDto>>.Success(products, "Filtered products retrieved", pagination);
        }
    }
}
