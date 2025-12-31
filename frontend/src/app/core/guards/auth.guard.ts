import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service'; 
import { ToastService } from '../../shared/services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authService.isLoggedIn()) {
    return true;
  }

  toastService.error('Devi effettuare il login per accedere a questa pagina.', 'Accesso Negato');
  
  router.navigate(['/']);
  
  return false;
};