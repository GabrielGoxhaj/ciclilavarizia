import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Address } from '../../../../shared/models/address.model';

@Component({
  selector: 'app-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifica Indirizzo' : 'Nuovo Indirizzo' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="addressForm" class="flex flex-col gap-3 pt-2">
        <mat-form-field appearance="outline">
          <mat-label>Indirizzo (Via/Piazza)</mat-label>
          <input matInput formControlName="addressLine1" />
          <mat-error>Obbligatorio</mat-error>
        </mat-form-field>

        <div class="flex gap-2">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Città</mat-label>
            <input matInput formControlName="city" />
            <mat-error>Obbligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-24">
            <mat-label>CAP</mat-label>
            <input matInput formControlName="postalCode" />
            <mat-error>Richiesto</mat-error>
          </mat-form-field>
        </div>

        <div class="flex gap-2">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Provincia</mat-label>
            <input matInput formControlName="stateProvince" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>Paese</mat-label>
            <input matInput formControlName="countryRegion" />
            <mat-error>Obbligatorio</mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Annulla</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="addressForm.invalid">
        {{ data ? 'Aggiorna' : 'Crea' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class AddressDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddressDialogComponent>);

  // dati passati in input (se null = creazione, se esiste = modifica)
  public data: Address | null = inject(MAT_DIALOG_DATA);

  addressForm = this.fb.group({
    addressLine1: [this.data?.addressLine1 || '', Validators.required],
    city: [this.data?.city || '', Validators.required],
    stateProvince: [this.data?.stateProvince || '' /*, Validators.required */],
    postalCode: [this.data?.postalCode || '', Validators.required],
    countryRegion: [this.data?.countryRegion || '', Validators.required],
  });

  save() {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.getRawValue();

      const finalData = {
        ...formValue,
        // gestione provincia vuota, analogo a quanto avviene nel checkout
        stateProvince: formValue.stateProvince?.trim() ? formValue.stateProvince : 'N/A', 
      };

      this.dialogRef.close(finalData);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
