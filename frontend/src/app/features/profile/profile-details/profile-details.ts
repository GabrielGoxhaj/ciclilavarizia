import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';
import { AccountService } from '../../../shared/services/account.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="max-w-3xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Dati Personali</h2>
        @if (!isEditing()) {
          <button mat-stroked-button color="primary" (click)="enableEdit()">
            <mat-icon>edit</mat-icon> Modifica
          </button>
        }
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-10">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      }

      @if (!isLoading()) {
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Nome</mat-label>
              <input matInput formControlName="firstName">
              @if (profileForm.get('firstName')?.hasError('required')) {
                <mat-error>Obbligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cognome</mat-label>
              <input matInput formControlName="lastName">
              @if (profileForm.get('lastName')?.hasError('required')) {
                <mat-error>Obbligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username">
              <mat-icon matSuffix>badge</mat-icon>
              @if (profileForm.get('username')?.hasError('required')) {
                <mat-error>Obbligatorio</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              @if (profileForm.get('email')?.hasError('email')) {
                <mat-error>Email non valida</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Telefono</mat-label>
              <input matInput formControlName="phone">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Azienda</mat-label>
              <input matInput formControlName="companyName">
              <mat-icon matSuffix>business</mat-icon>
            </mat-form-field>

          </div>

          @if (isEditing()) {
            <div class="flex gap-4 mt-6 justify-end bg-gray-50 p-4 rounded-lg border border-gray-100">
              <button mat-button type="button" (click)="cancelEdit()" [disabled]="isSaving()">
                Annulla
              </button>
              <button mat-flat-button color="primary" type="submit" [disabled]="profileForm.invalid || isSaving()">
                @if (isSaving()) {
                  <span class="mr-2">Salvataggio...</span>
                } @else {
                  Salva Modifiche
                }
              </button>
            </div>
          }
        </form>
      }
    </div>
  `
})
export class ProfileDetailsComponent implements OnInit {
  private accountService = inject(AccountService); 
  private authService = inject(AuthService); 
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  profileForm: FormGroup;
  isLoading = signal(true);
  isSaving = signal(false);
  isEditing = signal(false);
  originalData: any = null;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      companyName: ['']
    });
    this.profileForm.disable();
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    
    this.accountService.getProfile().subscribe({
      next: (res) => {
        const data = res?.data;
        
        if (!data) {
          this.toast.error('Dati profilo non disponibili');
          this.isLoading.set(false);
          return;
        }
        
        const currentUser = this.authService.currentUser();
        
        const formData = {
            firstName: data.firstName, 
            lastName: data.lastName,   
            username: data.username || currentUser?.username || '', 
            email: data.email || currentUser?.email || '',
            phone: data.phone,
            companyName: data.companyName
        };

        this.originalData = formData;
        this.profileForm.patchValue(formData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Impossibile caricare il profilo');
        this.isLoading.set(false);
      }
    });
  }

  enableEdit() {
    this.isEditing.set(true);
    this.profileForm.enable();
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.profileForm.disable();
    if (this.originalData) {
      this.profileForm.patchValue(this.originalData);
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const rawValues = this.profileForm.getRawValue();

    const payload = {
        ...rawValues,
        phone: rawValues.phone?.trim() ? rawValues.phone.trim() : null,
        companyName: rawValues.companyName?.trim() ? rawValues.companyName.trim() : null
    };

    this.accountService.updateProfile(payload).subscribe({
      next: () => {
        this.toast.success('Profilo aggiornato con successo');
        this.originalData = rawValues; 
        
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.profileForm.disable();
      },
      error: (err) => {
        console.error(err);
        const validationErrors = err.error?.errors;
        let msg = err.error?.message || 'Errore durante l\'aggiornamento';

        if (validationErrors) {
            const firstErrorKey = Object.keys(validationErrors)[0];
            msg = validationErrors[firstErrorKey][0];
        }

        this.toast.error(msg);
        this.isSaving.set(false);
      }
    });
  }
}