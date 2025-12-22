import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Components & Services
import { QuantitySelectorComponent } from '../../../shared/components/quantity-selector/quantity-selector';
import { CartService } from '../../../shared/services/cart.service';
import { CartItem } from '../../../shared/models/cart.model'; // Assicurati del percorso
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-show-cart-item',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    MatButtonModule, 
    MatIconModule, 
    QuantitySelectorComponent
  ],
  template: `
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        
        <!-- Immagine -->
        <a [routerLink]="['/products', item().productId]" class="shrink-0">
            <img
                [src]="imageUrl()"
                [alt]="item().name"
                class="w-24 h-24 rounded-lg object-contain border border-gray-100 bg-gray-50 hover:opacity-90 transition-opacity"
            />
        </a>

        <!-- Info Prodotto -->
        <div class="flex-1 min-w-0">
            <a [routerLink]="['/products', item().productId]" 
               class="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors block truncate">
                {{ item().name }}
            </a>
            <p class="text-gray-500 text-sm mt-1">
                Unit Price: {{ item().listPrice | currency:'USD' }}
            </p>
        </div>

        <!-- Azioni (Quantità + Delete) -->
        <div class="flex items-center gap-6 mt-2 sm:mt-0">
            
            <app-quantity-selector
                [quantity]="item().quantity"
                (quantityChange)="cartService.updateQuantity(item().productId, $event)"
            />

            <div class="text-right min-w-[80px]">
                <div class="font-bold text-lg text-gray-900">
                    {{ (item().listPrice * item().quantity) | currency:'USD' }}
                </div>
            </div>

            <button mat-icon-button color="warn" 
                    (click)="cartService.removeFromCart(item().productId)"
                    matTooltip="Remove item">
                <mat-icon>delete_outline</mat-icon>
            </button>
        </div>
    </div>
  `
})
export class ShowCartItem {
  cartService = inject(CartService);
  item = input.required<CartItem>();

  imageUrl = computed(() => {
    const url = this.item().thumbnailUrl;
    if (!url) return 'assets/images/placehold.webp';
    if (url.startsWith('http')) return url;
    
    // Aggiunge dominio backend
    const backendHost = environment.apiUrl.replace('/api', '');
    return `${backendHost}${url}`;
  });
}