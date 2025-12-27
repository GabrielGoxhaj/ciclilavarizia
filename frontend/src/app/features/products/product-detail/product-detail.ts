import { Component, inject, input, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';
import { QuantitySelectorComponent } from '../../../shared/components/quantity-selector/quantity-selector';
import { BackButton } from '../../../shared/components/back-button/back-button';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    TitleCasePipe,
    DecimalPipe,
    QuantitySelectorComponent,
    BackButton,
  ],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent {
  private productService = inject(ProductService);
  public cartService = inject(CartService);

  productId = input<string>();

  product = signal<Product | null>(null);
  isLoading = signal(true);
  quantity = signal(1);

  backRoute = computed(() => {
    const p = this.product();
    if (p && p.productCategoryId) {
      return ['/products', 'category', p.productCategoryId];
    }
    return ['/products', 'category', 'all'];
  });

  constructor() {
    effect(() => {
      const productId = this.productId();
      if (productId) {
        untracked(() => {
          this.loadProduct(Number(productId));
        });
      }
    });
  }

  loadProduct(productId: number) {
    this.isLoading.set(true);
    this.productService.getProductById(productId).subscribe({
      next: (res) => {
        this.product.set(res.data || null);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  private backendHost = environment.apiUrl.replace('/api', '');
  imageUrl = computed(() => {
    const url = this.product()?.thumbnailUrl;
    if (!url) return `${this.backendHost}/images/products/placehold.webp`;
    return `${this.backendHost}${url}`;
  });

  handleMissingImage(event: Event) {
    // chiamata quando l'immagine dà errore 404
    const imgElement = event.target as HTMLImageElement;
    const fallbackUrl = `${this.backendHost}/images/products/placehold.webp`;
    if (imgElement.src !== fallbackUrl) {
      imgElement.src = fallbackUrl;
    }
  }

  updateQuantity(newQty: number) {
    this.quantity.set(newQty);
  }

  productWithVat = computed(() => {
    const p = this.product();
    return p ? p.listPrice * 1.22 : 0;
  });

}
