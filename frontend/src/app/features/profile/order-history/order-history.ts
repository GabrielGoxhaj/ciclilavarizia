import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { OrderService } from '../../../shared/services/order.service';
import { Order } from '../../../shared/models/order.model';
import { OrderStatusPipe } from '../../../shared/pipes/order-status.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    DatePipe,
    CurrencyPipe,
    OrderStatusPipe,
  ],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <mat-icon class="text-blue-600">history</mat-icon>
        Storico Ordini
      </h2>

      @if (isLoading()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      } @if (!isLoading() && orders().length === 0) {
      <div class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
        <mat-icon class="text-gray-400 text-6xl mb-4 w-16 h-16">shopping_bag</mat-icon>
        <h3 class="text-lg font-medium text-gray-900">Nessun ordine effettuato</h3>
        <p class="text-gray-500 mb-6">Non hai ancora acquistato nulla.</p>
        <a mat-flat-button color="primary" routerLink="/products">Inizia a fare acquisti</a>
      </div>
      } @if (!isLoading() && orders().length > 0) {
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table mat-table [dataSource]="orders()" class="w-full">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>N. Ordine</th>
            <td mat-cell *matCellDef="let order" class="font-mono text-xs text-gray-500">
              #{{ order.salesOrderId }}
            </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Data</th>
            <td mat-cell *matCellDef="let order">
              {{ order.orderDate | date : 'dd MMMM yyyy' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Totale</th>
            <td mat-cell *matCellDef="let order" class="font-bold text-gray-900">
              {{ order.totalDue | currency : 'EUR' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Stato</th>
            <td mat-cell *matCellDef="let order">
              @let statusInfo = order.status | orderStatus;
              <span [class]="'px-2 py-1 rounded-full text-xs font-medium ' + statusInfo.cssClass">
                {{ statusInfo.label }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let order" class="text-right">
              <a
                mat-icon-button
                color="primary"
                [routerLink]="['/profile/orders', order.salesOrderId]"
                matTooltip="Vedi dettagli"
              >
                <mat-icon>visibility</mat-icon>
              </a>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            class="hover:bg-gray-50 transition-colors"
          ></tr>
        </table>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .mat-mdc-table {
        background: white;
      }
      .mat-mdc-header-cell {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
      }
    `,
  ],
})
export class OrderHistoryComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  displayedColumns: string[] = ['id', 'date', 'status', 'total', 'actions'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        const sortedOrders = (res.data || []).sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.orders.set(sortedOrders);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento ordini', err);
        this.isLoading.set(false);
      },
    });
  }
}
