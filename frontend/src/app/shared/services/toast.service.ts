import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: ToastType = 'info', duration = 3000): void {
    this.snackBar.open(message, 'Chiudi', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`toast-${type}`]
    });
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }
}