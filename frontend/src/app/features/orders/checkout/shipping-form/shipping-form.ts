import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-shipping-form',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    template: `
        <div [formGroup]="group" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline" class="col-span-1 md:col-span-2">
                <mat-label>Address</mat-label>
                <input matInput formControlName="addressLine1" placeholder="123 Main St" />
                <mat-error>Address is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" />
                <mat-error>City is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Postal Code</mat-label>
                <input matInput formControlName="postalCode" />
                <mat-error>Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Country</mat-label>
                <input matInput formControlName="countryRegion" />
                <mat-error>Required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>State / Province</mat-label>
                <input matInput formControlName="stateProvince" />
            </mat-form-field>
        </div>
    `
})
export class ShippingFormComponent {
    @Input({ required: true }) group!: FormGroup;
}