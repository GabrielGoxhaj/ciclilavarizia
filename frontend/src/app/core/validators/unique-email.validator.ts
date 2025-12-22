import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';

export class EmailValidators {
    static createUniqueEmailValidator(authService: AuthService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.value || control.invalid) {
                return of(null);
            }

            return timer(500).pipe(
                switchMap(() => authService.checkEmailAvailability(control.value)),
                map((isAvailable) => {
                    return isAvailable ? null : { emailTaken: true };
                }),
                catchError(() => of(null)) 
            );
        };
    }
}