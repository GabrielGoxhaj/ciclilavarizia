import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm sticky top-24">
      <h2 class="text-xl font-bold mb-6">Riepilogo Ordine</h2>

      <div class="space-y-4 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>Imponibile (Articoli)</span>
          <span class="font-medium text-gray-900">{{ subtotal() | currency : 'EUR' }}</span>
        </div>
        <div class="flex justify-between">
          <span>Spedizione</span>
          <span>{{ freight() | currency : 'EUR' }}</span>
        </div>
        <div class="flex justify-between">
          <span>IVA (22%)</span>
          <span>{{ tax() | currency : 'EUR' }}</span>
        </div>

        <div class="h-px bg-gray-100 my-4"></div>

        <div class="flex justify-between items-center text-lg font-bold text-gray-900">
          <span class="text-base font-bold text-gray-900 pb-1">Totale Ordine</span>
          <span>{{ total() | currency : 'EUR' }}</span>
        </div>
      </div>

      <!-- bottone checkout -->
      <ng-content select="[actionButtons]"></ng-content>

      <div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span class="material-icons text-[16px]">lock</span>
        Pagamento SSL Sicuro
      </div>
    </div>
  `,
})
export class OrderSummary {
  cartService = inject(CartService);

  subtotal = computed(() =>
    this.cartService.cartItems().reduce((acc, item) => acc + item.listPrice * item.quantity, 0)
  );

  tax = computed(() => this.subtotal() * 0.22);
  freight = signal<number>(5.0); // Flat rate for demonstration
  total = computed(() => this.subtotal() + this.tax() + this.freight());
}
