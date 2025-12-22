import { Component, computed, inject, input} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProductListItem } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-product-card',
    imports: [MatButtonModule, MatIcon, CurrencyPipe, RouterModule, MatTooltipModule],
    templateUrl: './product-card.html',
    styleUrl: './product-card.css',
})
export class ProductCard {
    cartService = inject(CartService);

    product = input.required<ProductListItem>();

    imageUrl = computed(() => {
    const url = this.product().thumbnailUrl;

    // 1. Se non c'è URL, usa un placeholder locale di fallback
    // if (!url) return 'assets/images/placeholder.webp';

    // 2. Se l'URL è già assoluto (inizia con http), usalo così com'è
    // if (url.startsWith('http')) return url;

    // 3. Se l'URL è relativo (es. /images/products/...), dobbiamo aggiungere il dominio del backend.
    // environment.apiUrl è solitamente "https://localhost:7061/api"
    // Noi vogliamo ottenere solo "https://localhost:7061"
    const backendHost = environment.apiUrl.replace('/api', '');

    // Restituisce es: https://localhost:7061/images/products/placehold.webp
    return `${backendHost}${url}`;
  });
}
