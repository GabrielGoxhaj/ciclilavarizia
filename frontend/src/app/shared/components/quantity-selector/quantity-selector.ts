import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center border border-gray-300 rounded-md">
      <button mat-icon-button (click)="decrease()" [disabled]="quantity() <= 1" class="w-8! h-8! flex items-center justify-center">
        <mat-icon class="text-sm!">remove</mat-icon>
      </button>
      <span class="w-8 text-center font-medium text-gray-900">{{ quantity() }}</span>
      <button mat-icon-button (click)="increase()" class="w-8! h-8! flex items-center justify-center">
        <mat-icon class="text-sm!">add</mat-icon>
      </button>
    </div>
  `
})
export class QuantitySelectorComponent {
  quantity = input.required<number>(); 
  quantityChange = output<number>();  

  increase() {
    this.quantityChange.emit(this.quantity() + 1);
  }

  decrease() {
    if (this.quantity() > 1) {
      this.quantityChange.emit(this.quantity() - 1);
    }
  }
}