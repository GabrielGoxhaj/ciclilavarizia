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
                <mat-label>Via/Piazza</mat-label>
                <input matInput formControlName="addressLine1" placeholder="123 Main St" />
                <mat-error>Il campo è obbligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Città</mat-label>
                <input matInput formControlName="city" />
                <mat-error>Il campo è obbligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Codice Postale</mat-label>
                <input matInput formControlName="postalCode" />
                <mat-error>Il campo è obbligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Stato</mat-label>
                <input matInput formControlName="countryRegion" />
                <mat-error>Il campo è obbligatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
                <mat-label>Provincia</mat-label>
                <input matInput formControlName="stateProvince" />
            </mat-form-field>
        </div>
    `
})
export class ShippingFormComponent {
    @Input({ required: true }) group!: FormGroup;
}