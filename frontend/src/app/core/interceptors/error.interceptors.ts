import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Si è verificato un errore imprevisto.';

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error && error.error.errors) {
        const firstKey = Object.keys(error.error.errors)[0];
        errorMessage = error.error.errors[firstKey][0];
      } else {
        if (error.status === 0) {
          // errore di rete (server spento / no internet)
          errorMessage = 'Impossibile contattare il server. Controlla la connessione.';
        } else if (error.status === 401) {
          // non autorizzato (gestito col redirect al login)
          // return throwError(() => error);
          errorMessage = 'Sessione scaduta o non autorizzata.';
        } else if (error.status === 404) {
          // not found
          errorMessage = 'La risorsa richiesta non è stata trovata.';
        } else if (error.status >= 500) {
          // server error
          errorMessage = 'Errore interno del server. Riprova più tardi.';
        }
      }

      // mostra il toast globale
      toastService.error(errorMessage, `Errore ${error.status}`);

      // rilancia l'errore così il componente può spegnere lo spinner (isLoading = false)
      return throwError(() => error);
    })
  );
};
