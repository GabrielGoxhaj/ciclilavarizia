import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm sticky top-24">
        <h2 class="text-xl font-bold mb-6">Order Summary</h2>

        <div class="space-y-4 text-sm text-gray-600">
            <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-medium text-gray-900">{{ subtotal() | currency:'USD' }}</span>
            </div>    
            <div class="flex justify-between">
                <span>Shipping</span>
                <span class="text-green-600 font-medium">Free</span>
            </div>    
            <div class="flex justify-between">
                <span>Tax (Estimated)</span>
                <span>{{ tax() | currency:'USD' }}</span>
            </div>   
            
            <div class="h-px bg-gray-100 my-4"></div>

            <div class="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{{ total() | currency:'USD' }}</span>
            </div>    
        </div>

        <!-- Proiezione del bottone checkout -->
        <ng-content select="[actionButtons]"></ng-content>
        
        <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span class="material-icons text-[16px]">lock</span>
            Secure Checkout
        </div>
    </div>
  `
})
export class OrderSummary {
  cartService = inject(CartService);

  subtotal = computed(() =>
    this.cartService.cartItems().reduce((acc, item) => acc + (item.listPrice * item.quantity), 0)
  );
  
  // Esempio logica futura: tasse 10%
  tax = computed(() => this.subtotal() * 0.1);
  
  total = computed(() => this.subtotal() + this.tax());
}