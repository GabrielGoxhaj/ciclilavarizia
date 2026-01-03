import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../shared/services/toast.service';
import { AccountService } from '../../../shared/services/account.service';
import { matchPasswordValidator } from '../../../core/validators/match-password.validator';
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';

@Component({
  selector: 'app-profile-security',
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
  templateUrl: './profile-security.html'
})
export class ProfileSecurityComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private toast = inject(ToastService);

  isLoading = signal(false);
  hideOld = signal(true);
  hideNew = signal(true);
  hideConfirm = signal(true);

  passwordForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [
      Validators.required, 
      Validators.minLength(8), 
      passwordStrengthValidator() 
    ]],
    confirmNewPassword: ['', Validators.required]
  }, { 
    validators: matchPasswordValidator('newPassword', 'confirmNewPassword') 
  });

  get newPasswordControl() { return this.passwordForm.get('newPassword'); }

  get passwordErrorMessage(): string {
    const control = this.newPasswordControl;
    if (control?.hasError('required')) return 'La nuova password è obbligatoria';
    if (control?.hasError('minlength')) return 'Minimo 8 caratteri';
    if (control?.hasError('passwordStrength')) {
        const err = control.errors!['passwordStrength'];
        const missing = [];
        if (!err.hasUpperCase) missing.push('Maiuscola');
        if (!err.hasLowerCase) missing.push('Minuscola');
        if (!err.hasNumeric) missing.push('Numero');
        return 'Mancante: ' + missing.join(', ');
    }
    return '';
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading.set(true);
    const req = this.passwordForm.getRawValue();

    this.accountService.changePassword({
      oldPassword: req.oldPassword!,
      newPassword: req.newPassword!,
      confirmNewPassword: req.confirmNewPassword!
    }).subscribe({
      next: () => {
        this.toast.success('Password modificata con successo');
        this.isLoading.set(false);
        this.passwordForm.reset(); 
        
        Object.keys(this.passwordForm.controls).forEach(key => {
          this.passwordForm.get(key)?.setErrors(null);
        });
      },
      error: (err) => {
        console.error(err);
        // mex dal backend
        const msg = err.error?.message || 'Errore durante il cambio password';
        this.toast.error(msg, 'Errore');
        this.isLoading.set(false);
      }
    });
  }
}