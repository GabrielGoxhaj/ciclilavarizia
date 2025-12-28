import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { catchError, map, of } from 'rxjs';

export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(ProductService);
  
  const id = route.paramMap.get('productId');

  if (!id) return of(null);

  return productService.getProductById(Number(id)).pipe(
    map((response) => response.data || null), 

    catchError((error) => {
      console.error('Errore nel recupero del prodotto:', error);
      return of(null);
    })
  );
};