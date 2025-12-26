import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  errorMessage = signal('');

  registrationForm = this.fb.group({
    personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required], 
        email: [
            '',
            [Validators.required, Validators.email],
            [EmailValidators.createUniqueEmailValidator(this.authService)],
        ],
        phone: ['', [Validators.pattern(/^\+?[0-9 \-\(\)]*$/), Validators.minLength(7), Validators.maxLength(25)]],
        password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
        confirmPassword: ['', Validators.required],
    }, { validators: matchPasswordValidator('password', 'confirmPassword') }),
    
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

  get passwordErrorMessage(): string {
    const control = this.personalInfo.get('password');
    if (control?.hasError('required')) return 'La password è obbligatoria';
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
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formValue = this.registrationForm.getRawValue();
    const info = formValue.personalInfo!;
    const addr = formValue.address!;

    const addresses: AddressDto[] = [];
    if (addr.addressLine1?.trim()) {
        addresses.push({
            addressType: 'Shipping',
            addressLine1: addr.addressLine1!,
            city: addr.city!,
            stateProvince: addr.stateProvince || undefined,
            postalCode: addr.postalCode!,
            countryRegion: addr.countryRegion!
        });
    }

    const payload: CustomerRegistrationRequest = {
        firstName: info.firstName!,
        lastName: info.lastName!,
        email: info.email!,
        username: info.username!, 
        password: info.password!,
        phone: info.phone || undefined,
        addresses: addresses.length > 0 ? addresses : undefined
    };

    this.authService.register(payload).subscribe({
        next: (res) => {
            console.log('Registered', res);
            this.authService.login({ email: payload.email, password: payload.password }).subscribe({
                next: () => this.router.navigate(['/']),
                error: () => {
                    this.isLoading.set(false);
                    this.router.navigate(['/login']);
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