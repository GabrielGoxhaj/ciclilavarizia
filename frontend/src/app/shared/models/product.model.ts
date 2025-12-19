export interface Category {
  productCategoryId: number;
  name: string;
  parentProductCategoryId?: number | null;
}

export interface ProductModel {
  productModelId: number;
  name: string;
}

export interface ProductDescription {
  productDescriptionId: number;
  description: string;
}

export interface Product {
  productId: number;
  name: string;
  productNumber?: string;
  color?: string;
  listPrice: number;
  size?: string;
  weight?: number;
  thumbnailUrl?: string;
  thumbnailFileName?: string;

  productCategoryId?: number;
  category?: Category;

  productModelId?: number;
  model?: ProductModel;

  description?: ProductDescription;
}

export interface ProductListItem {
  productId: number;
  name: string;
  productNumber: string;
  listPrice: number;
  thumbnailUrl: string;
  isAvailable: boolean;
  description?: string;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  sort?: string; // 'price_asc', 'price_desc', 'name_asc', 'name_desc'
  page: number;
  pageSize: number;
}
