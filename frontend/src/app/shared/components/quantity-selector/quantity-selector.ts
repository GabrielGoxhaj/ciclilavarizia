import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex items-center ">
      <button
        mat-icon-button
        (click)="decrease()"
        [disabled]="quantity() <= 1"
        class="w-8 h-8 p-0 flex items-center justify-center"
      >
        <mat-icon class="text-sm w-4 h-4 flex items-center justify-center leading-none"
          >remove</mat-icon
        >
      </button>

      <span class="w-8 text-center font-medium text-gray-900">{{ quantity() }}</span>
      <button
        mat-icon-button
        (click)="increase()"
        class="w-8 h-8 p-0 flex items-center justify-center"
      >
        <mat-icon class="text-sm w-4 h-4 flex items-center justify-center leading-none"
          >add</mat-icon
        >
      </button>
    </div>
  `,
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
