import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category, Product, ProductFilter, ProductListItem } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getProducts(filter: ProductFilter): Observable<ApiResponse<ProductListItem[]>> {
    let params = new HttpParams().set('page', filter.page).set('pageSize', filter.pageSize);

    if (filter.search) params = params.set('search', filter.search);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice);
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice);
    if (filter.color) params = params.set('color', filter.color);
    if (filter.size) params = params.set('size', filter.size);
    if (filter.sort) params = params.set('sort', filter.sort);

    return this.http.get<ApiResponse<ProductListItem[]>>(`${this.baseUrl}/products/search`, { params });
  }

  // GET: api/Products/{id}
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`);
  }

  // GET: api/Categories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/categories`);
  }
}
