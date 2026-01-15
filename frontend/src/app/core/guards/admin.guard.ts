import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!authService.isLoggedIn()) {
    toastService.error('Devi effettuare il login per accedere.', 'Accesso Negato');
    router.navigate(['/']); 
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  toastService.error('Non hai i permessi per accedere all\'area amministrativa.', 'Proibito');
  router.navigate(['/']); 
  return false;
};