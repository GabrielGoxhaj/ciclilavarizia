import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';
import { AccountService } from '../../../shared/services/account.service';
import { Address } from '../../../shared/models/address.model';
import { AddressDialogComponent } from './address-dialog/address-dialog';

@Component({
  selector: 'app-user-addresses',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatProgressSpinnerModule
  ],
  template: `
    <div class="max-w-5xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">I miei Indirizzi</h2>
        <button mat-flat-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuovo Indirizzo
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!isLoading()) {
        
        <!-- empty state -->
        @if (addresses().length === 0) {
          <div class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
            <mat-icon class="text-gray-400 text-5xl mb-2">location_off</mat-icon>
            <p class="text-gray-500">Non hai ancora salvato nessun indirizzo.</p>
          </div>
        }

        <!-- address list -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (addr of addresses(); track addr.addressId) {
            <mat-card class="shadow-sm! hover:shadow-md! transition-shadow border border-gray-200">
              <mat-card-header>
                <mat-card-title class="text-lg! font-bold! text-gray-800 flex items-center gap-2">
                  <mat-icon class="text-gray-400 text-sm">place</mat-icon> 
                  {{ addr.city }}
                </mat-card-title>
                <!-- <mat-card-subtitle>Default Shipping</mat-card-subtitle> -->
              </mat-card-header>
              
              <mat-card-content class="pt-4! text-gray-600 text-sm min-h-20">
                <p class="font-medium">{{ addr.addressLine1 }}</p>
                <p>{{ addr.postalCode }} 
                  @if (addr.stateProvince) {
                  - {{ addr.stateProvince }}
                  }
                </p>
                <p>{{ addr.countryRegion }}</p>
              </mat-card-content>

              <mat-card-actions align="end" class="border-t border-gray-100 py-2!">
                <button mat-button color="primary" (click)="openDialog(addr)">Modifica</button>
                <button mat-button color="warn" (click)="deleteAddress(addr)">Elimina</button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `
})
export class UserAddressesComponent implements OnInit {
  private accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  addresses = signal<Address[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.isLoading.set(true);
    this.accountService.getAddresses().subscribe({
      next: (res) => {
        this.addresses.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openDialog(addressToEdit?: Address) {
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      width: '500px',
      data: addressToEdit || null // passa i dati se modifica, null se crea
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (addressToEdit && addressToEdit.addressId) {
          this.update(addressToEdit.addressId, result);
        } else {
          this.create(result);
        }
      }
    });
  }

  create(data: Address) {
    data.addressType = 'Shipping';  // hardcoded anche nel backend
    this.accountService.addAddress(data).subscribe({
      next: () => {
        this.toast.success('Indirizzo aggiunto');
        this.loadAddresses();
      },
      error: (err) => this.toast.error(err.error?.message || 'Errore creazione')
    });
  }

  update(id: number, data: Address) {
    this.accountService.updateAddress(id, data).subscribe({
      next: () => {
        this.toast.success('Indirizzo aggiornato');
        this.loadAddresses();
      },
      error: (err) => this.toast.error('Errore aggiornamento')
    });
  }

  deleteAddress(addr: Address) {
    if(!addr.addressId) return;
    
    if (confirm('Sei sicuro di voler eliminare questo indirizzo?')) {
      this.accountService.deleteAddress(addr.addressId).subscribe({
        next: () => {
          this.toast.info('Indirizzo eliminato');
          this.loadAddresses();
        },
        error: () => this.toast.error('Impossibile eliminare indirizzo')
      });
    }
  }
}