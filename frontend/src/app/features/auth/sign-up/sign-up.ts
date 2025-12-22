import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Services & Validators
import { AuthService } from '../../../shared/services/auth.service';
import { matchPasswordValidator } from '../../../core/validators/match-password.validator';
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';
import { EmailValidators } from '../../../core/validators/unique-email.validator';
import { conditionalRequiredGroupValidator } from '../../../core/validators/optional-group.validator';
import { CustomerRegistrationRequest, AddressDto } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './sign-up.html',
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  passwordVisible = signal(false);
  errorMessage = signal('');

  registrationForm = this.fb.group({
    personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [
            '',
            [Validators.required, Validators.email],
            [EmailValidators.createUniqueEmailValidator(this.authService)],
        ],
        phone: ['', [Validators.pattern(/^\+?[0-9 \-\(\)]*$/), Validators.minLength(7)]],
        password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required],
    }, { validators: matchPasswordValidator('password', 'confirmPassword') }),
    
    // Address Group (Opzionale)
    address: this.fb.group({
        addressLine1: [''],
        city: [''],
        stateProvince: [''],
        postalCode: [''],
        countryRegion: [''],
    }, { validators: conditionalRequiredGroupValidator(['addressLine1', 'city', 'postalCode', 'countryRegion']) })
  });

  get personalInfo() { return this.registrationForm.get('personalInfo') as FormGroup; }
  get addressGroup() { return this.registrationForm.get('address') as FormGroup; }

  // Helper per messaggi errore password
  get passwordErrorMessage(): string {
    const control = this.personalInfo.get('password');
    if (control?.hasError('required')) return 'Password is required';
    if (control?.hasError('minlength')) return 'Min 8 characters';
    if (control?.hasError('passwordStrength')) {
        const err = control.errors!['passwordStrength'];
        const missing = [];
        if (!err.hasUpperCase) missing.push('Uppercase');
        if (!err.hasLowerCase) missing.push('Lowercase');
        if (!err.hasNumeric) missing.push('Number');
        return 'Missing: ' + missing.join(', ');
    }
    return '';
  }

  onSubmit() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.registrationForm.getRawValue();
    const info = formValue.personalInfo!;
    const addr = formValue.address!;

    // Costruzione indirizzi
    const addresses: AddressDto[] = [];
    if (addr.addressLine1?.trim()) {
        addresses.push({
            addressType: 'Shipping', // Default
            addressLine1: addr.addressLine1!,
            city: addr.city!,
            stateProvince: addr.stateProvince || undefined, // undefined invece di null per l'interfaccia
            postalCode: addr.postalCode!,
            countryRegion: addr.countryRegion!
        });
    }

    // Costruzione Payload finale
    const payload: CustomerRegistrationRequest = {
        firstName: info.firstName!,
        lastName: info.lastName!,
        email: info.email!,
        username: info.email!, // Uso la mail come username
        password: info.password!,
        phone: info.phone || undefined,
        addresses: addresses.length > 0 ? addresses : undefined
    };

    this.authService.register(payload).subscribe({
        next: (res) => {
            console.log('Registered', res);
            // Auto Login dopo registrazione
            this.authService.login({ email: payload.email, password: payload.password }).subscribe({
                next: () => this.router.navigate(['/']),
                error: () => {
                    this.isLoading.set(false);
                    this.router.navigate(['/login']); // Fallback se auto-login fallisce
                }
            });
        },
        error: (err) => {
            console.error(err);
            this.isLoading.set(false);
            this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
        }
    });
  }
}