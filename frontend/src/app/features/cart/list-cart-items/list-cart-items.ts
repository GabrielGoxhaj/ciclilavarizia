import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart.service';
import { ShowCartItem } from '../show-cart-item/show-cart-item';

@Component({
  selector: 'app-list-cart-items',
  standalone: true,
  imports: [CommonModule, ShowCartItem],
  template: `
    <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h2 class="text-xl font-bold mb-6 border-b border-gray-100 pb-4">
            Cart Items ({{ cartService.count() }})
        </h2>
        
        <div class="flex flex-col gap-6">
            @for(item of cartService.cartItems(); track item.productId){
                <app-show-cart-item [item]="item"></app-show-cart-item>
                
                <!-- Separatore tra gli item tranne l'ultimo -->
                @if(!$last) {
                    <div class="h-px bg-gray-100"></div>
                }
            }
        </div>
    </div>
  `,
})
export class ListCartItems {
  cartService = inject(CartService);
}