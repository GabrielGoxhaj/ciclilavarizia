import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login.html',
})
export class LoginComponent { 
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(NonNullableFormBuilder);
  passwordVisible = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Form Definition
  signInForm = this.fb.group({
    email: ['claudio.orloffo@example.com', [Validators.required, Validators.email]], 
    password: ['On1off0!', Validators.required],
  });

  signIn() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.signInForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('Login effettuato:', response);
        this.isLoading.set(false);
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error('Errore login:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Email o password non corretti.');
      },
    });
  }
}