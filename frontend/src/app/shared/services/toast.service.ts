import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastType = 'success' | 'error' | 'warn' | 'info'; 

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  show(message: string, type: ToastType = 'info', title: string = '', duration = 3000): void {
    this.messageService.add({
      severity: type,
      summary: title, 
      detail: message, 
      life: duration  
    });
  }

  success(message: string, title: string = 'Successo', duration = 2000): void {
    this.show(message, 'success', title, duration);
  }

  error(message: string, title: string = 'Errore', duration = 4000): void {
    this.show(message, 'error', title, duration);
  }

  warning(message: string, title: string = 'Attenzione', duration = 4000): void {
    this.show(message, 'warn', title, duration);
  }

  info(message: string, title: string = 'Info', duration = 2000): void {
    this.show(message, 'info', title, duration);
  }
  
  clear() {
      this.messageService.clear();
  }
}