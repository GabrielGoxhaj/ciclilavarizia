import { Component, inject, input, signal, computed, effect, untracked } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Services & Models
import { ProductService } from '../../../shared/services/product.service';
import { CartService } from '../../../shared/services/cart.service';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environment';
// Components
import { QuantitySelectorComponent } from '../../../shared/components/quantity-selector/quantity-selector';

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
    QuantitySelectorComponent
  ],
  templateUrl: './product-detail.html',
})
export class ProductDetailComponent {
  private productService = inject(ProductService);
  public cartService = inject(CartService); // Public per usarlo nell'HTML

  // Input dall'URL (es. /products/723 -> id = "723")
  productId = input<string>();

  product = signal<Product | null>(null);
  isLoading = signal(true);
  quantity = signal(1);

  // Calcolo URL immagine corretto
  imageUrl = computed(() => {
    const p = this.product();
    if (!p) return 'assets/images/placehold.webp';

    const url = p.thumbnailUrl;
    if (!url) return 'assets/images/placehold.webp';
    if (url.startsWith('http')) return url;

    // Aggiunge dominio backend
    const backendHost = environment.apiUrl.replace('/api', '');
    return `${backendHost}${url}`;
  });

  // Calcolo rotta "Indietro"
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
      }
    });
  }

  updateQuantity(newQty: number) {
    this.quantity.set(newQty);
  }
}