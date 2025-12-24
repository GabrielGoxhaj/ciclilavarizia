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
    private backendHost = environment.apiUrl.replace('/api', '');
    imageUrl = computed(() => {
        const url = this.product().thumbnailUrl;
        if (!url) return `${this.backendHost}/images/products/placehold.webp`; 
        
        return `${this.backendHost}${url}`;
    });

    handleMissingImage(event: Event) { // chiamata quando l'immagine dà errore 404
        const imgElement = event.target as HTMLImageElement;
        const fallbackUrl = `${this.backendHost}/images/products/placehold.webp`;
        if (imgElement.src !== fallbackUrl) {
            imgElement.src = fallbackUrl;
        }
    }
}
