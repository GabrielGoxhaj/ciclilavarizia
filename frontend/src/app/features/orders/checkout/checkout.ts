import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { switchMap, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartService } from '../../../shared/services/cart.service';
import { OrderService } from '../../../shared/services/order.service';
import { CustomerService } from '../../../shared/services/customer.service';
import { ShippingFormComponent } from './shipping-form/shipping-form';
import { PaymentFormComponent } from './payment-form/payment-form';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { Address, CreateAddressRequest } from '../../../shared/models/address.model';
import { CreateOrderRequest } from '../../../shared/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatRadioModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatProgressSpinnerModule,
    ShippingFormComponent, PaymentFormComponent, OrderSummary, BackButton, CurrencyPipe
  ],
  templateUrl: './checkout.html',
})
export default class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  customerService = inject(CustomerService);

  isProcessing = signal(false);
  addresses = signal<Address[]>([]);
  useSavedAddress = signal(true);

  checkoutForm = this.fb.group({
    existingAddressId: [null as number | null],
    addressLine1: [''],
    city: [''],
    postalCode: [''],
    countryRegion: [''],
    stateProvince: [''],
  });

  ngOnInit(): void {
    if (this.cartService.count() === 0) {
        this.router.navigate(['/products']);
        return;
    }

     this.customerService.getMyAddresses().subscribe({
      next: (response) => {
        const addresses = response.data || []; 
        
        this.addresses.set(addresses);
        this.toggleAddressMode(addresses.length > 0); 
      },
      error: () => this.toggleAddressMode(false)
    });
  }

  toggleAddressMode(useSaved: boolean) {
    this.useSavedAddress.set(useSaved);
    const controls = this.checkoutForm.controls;

    if (useSaved) {
        controls.existingAddressId.setValidators(Validators.required);
        ['addressLine1', 'city', 'postalCode', 'countryRegion'].forEach(k => {
            this.checkoutForm.get(k)?.clearValidators();
            this.checkoutForm.get(k)?.updateValueAndValidity();
        });
    } else {
        controls.existingAddressId.clearValidators();
        ['addressLine1', 'city', 'postalCode', 'countryRegion'].forEach(k => {
            this.checkoutForm.get(k)?.setValidators(Validators.required);
            this.checkoutForm.get(k)?.updateValueAndValidity();
        });
    }
    controls.existingAddressId.updateValueAndValidity();
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isProcessing.set(true);
    const val = this.checkoutForm.getRawValue();

    let addressIdObservable;

    if (this.useSavedAddress()) {
        addressIdObservable = of(val.existingAddressId!); 
    } else {
        const newAddress: CreateAddressRequest = {
            addressType: 'Shipping',
            addressLine1: val.addressLine1!,
            city: val.city!,
            postalCode: val.postalCode!,
            countryRegion: val.countryRegion!,
            stateProvince: val.stateProvince || 'N/A'
        };
        
        addressIdObservable = this.customerService.createAddress(newAddress).pipe(
            switchMap(res => of(res.data!.addressId)) 
        );
    }

    addressIdObservable.pipe(
        switchMap((addressId) => {
            const orderPayload: CreateOrderRequest = {
                addressId: addressId,
                items: this.cartService.cartItems().map(i => ({
                    productId: i.productId,
                    quantity: i.quantity
                }))
            };
            return this.orderService.createOrder(orderPayload);
        })
    ).subscribe({
        next: (res) => {
            this.cartService.clearCart();
            const orderId = res.data!.salesOrderId; 
            this.router.navigate(['/order-success', orderId]);
        },
        error: (err) => {
            console.error(err);
            this.isProcessing.set(false);
            alert('Order failed: ' + (err.error?.message || 'Unknown error'));
        }
    });
  }
}