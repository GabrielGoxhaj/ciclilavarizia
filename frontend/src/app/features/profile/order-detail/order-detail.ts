import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    CurrencyPipe,
    DatePipe,
    OrderStatusPipe,
    MatProgressSpinnerModule,
    BackButton,
  ],
  template: `
    @if (order(); as o) {
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <app-back-button [navigateTo]="'/profile/orders'">Torna agli ordini</app-back-button>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div
          class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <div>
            <h2 class="text-xl font-bold text-gray-900">Ordine #{{ o.salesOrderId }}</h2>
            <p class="text-sm text-gray-500">{{ o.orderDate | date : 'fullDate' }}</p>
          </div>
          @let statusInfo = o.status | orderStatus;
          <span [class]="'px-3 py-1 rounded-full text-sm font-medium ' + statusInfo.cssClass">
            Stato: {{ statusInfo.label }}
          </span>
        </div>

        <div class="p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Articoli</h3>
          <ul class="divide-y divide-gray-100">
            @for (item of o.orderDetails; track item.productId) {
            <li class="py-4 flex justify-between items-center">
              <div class="flex items-center gap-4">
                <div
                  class="h-16 w-16 bg-white border border-gray-200 rounded-md overflow-hidden shrink-0 flex items-center justify-center"
                >
                  <img
                    [src]="getImageUrl(item.thumbnailUrl)"
                    alt="{{ item.productName }}"
                    class="w-full h-full object-contain p-1"
                    (error)="handleMissingImage($event)"
                  />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ item.productName }}</p>
                  <p class="text-sm text-gray-500">
                    Qtà: {{ item.quantity }} x {{ item.unitPrice | currency : 'EUR' }}
                  </p>
                </div>
              </div>
              <p class="font-bold text-gray-900">{{ item.lineTotal | currency : 'EUR' }}</p>
            </li>
            }
          </ul>
        </div>

        <div class="bg-gray-50 p-6 border-t border-gray-200">
          <div class="flex justify-end">
            <div class="w-full sm:w-1/2 md:w-1/3 space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotale</span>
                <span>{{ o.subTotal | currency : 'EUR' }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Spedizione</span>
                <span>{{ o.freight | currency : 'EUR' }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Tasse</span>
                <span>{{ o.taxAmt | currency : 'EUR' }}</span>
              </div>
              <div
                class="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900"
              >
                <span>Totale</span>
                <span>{{ o.totalDue | currency : 'EUR' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    } @else {
    <div class="flex justify-center py-10">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
    }
  `,
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(Number(id)).subscribe({
        next: (res) => this.order.set(res.data || null),
        error: (err) => console.error(err),
      });
    }
  }

  private backendHost = environment.apiUrl.replace('/api', '');

  getImageUrl(url?: string): string {
    if (!url) return `${this.backendHost}/images/products/placehold.webp`;
    return `${this.backendHost}${url}`;
  }

  handleMissingImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const fallbackUrl = `${this.backendHost}/images/products/placehold.webp`;
    if (imgElement.src !== fallbackUrl) {
      imgElement.src = fallbackUrl;
    }
  }
}
