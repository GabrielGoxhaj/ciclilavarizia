import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { CustomerService } from '../../../shared/services/customer.service';
import { Customer

 } from '../../../shared/models/customer.model';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestione Clienti</h1>
          <p class="text-gray-500 text-sm">Visualizza e gestisci l'anagrafica clienti</p>
        </div>
        <!-- per creare manualmente un customer (senza login) -->
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon> Nuovo Cliente
        </button>
      </div>

      <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        
        @if (isLoading()) {
          <div class="flex justify-center p-12">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        }

        @if (!isLoading()) {
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="customers()" class="w-full">

              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let customer" class="text-gray-500 font-mono text-xs">
                  #{{ customer.customerId }}
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Nome Completo </th>
                <td mat-cell *matCellDef="let customer" class="font-medium text-gray-900">
                  {{ customer.fullName }}
                </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef> Email </th>
                <td mat-cell *matCellDef="let customer" class="text-gray-600">
                  {{ customer.email }}
                </td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef> Telefono </th>
                <td mat-cell *matCellDef="let customer" class="text-gray-600">
                  {{ customer.phone || '-' }}
                </td>
              </ng-container>

              <!-- actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> </th>
                <td mat-cell *matCellDef="let customer" class="text-right">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item>
                      <mat-icon>edit</mat-icon>
                      <span>Modifica</span>
                    </button>
                    <button mat-menu-item class="text-red-600!">
                      <mat-icon class="text-red-600!">delete</mat-icon>
                      <span>Elimina</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>
            </table>
          </div>

          <!-- paginator -->
          <mat-paginator
            [length]="totalItems()"
            [pageSize]="pageSize()"
            [pageIndex]="pageIndex()"
            [pageSizeOptions]="[10, 20, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-header-cell { 
      background-color: #f9fafb; 
      color: #6b7280; 
      font-size: 0.75rem; 
      text-transform: uppercase; 
      font-weight: 600; 
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  totalItems = signal(0);
  isLoading = signal(true);

  pageSize = signal(20);
  pageIndex = signal(0); 

  displayedColumns = ['id', 'name', 'email', 'phone', 'actions'];

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);

    const apiPage = this.pageIndex() + 1; 

    this.customerService.getAllCustomers(apiPage, this.pageSize()).subscribe({
      next: (res) => {
        this.customers.set(res.data || []);
        
        if (res.pagination) {
            this.totalItems.set(res.pagination.totalItems);
        } else {
            this.totalItems.set(res.data?.length || 0); 
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento clienti', err);
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadCustomers();
  }
}