export interface Product {
  productId: number;
  name: string;
  productNumber: string;
  color?: string;
  listPrice: number;
  size?: string;
  weight?: number;
  productCategoryId?: number;
}

export interface ProductDto {
  productId: number;
  name: string;
  productNumber: string;
  color: string;
  listPrice: number;
  size: string;
  weight: number;
  productCategoryId: number;
}
