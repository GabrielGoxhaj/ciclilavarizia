import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-payment-form',
    standalone: true,
    imports: [MatRadioModule],
    template: `
        <div class="border border-gray-200 rounded-xl p-6 bg-white mt-6">
            <h2 class="text-xl font-bold mb-4">Payment Method</h2>
            <mat-radio-group [value]="'stripe'">
                <mat-radio-button value="stripe" color="primary" class="!flex items-center">
                    <span class="ml-2 font-medium">Credit Card (Stripe)</span>
                </mat-radio-button>
            </mat-radio-group>
        </div>
    `
})
export class PaymentFormComponent {}