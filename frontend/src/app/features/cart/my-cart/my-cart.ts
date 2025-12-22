import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListCartItems } from '../list-cart-items/list-cart-items';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../core/components/login/login'; // Assicurati del nome corretto

@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    ListCartItems,
    OrderSummary,
    BackButton
  ],
  templateUrl: './my-cart.html',
})
export default class MyCartComponent {
  cartService = inject(CartService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  proceedToCheckout() {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in -> Proceeding to checkout (Not implemented)');
      alert('Checkout page coming soon!');
    } else {
      console.log('User not logged in -> Opening Login Dialog');
      
      // Apre il modal di login che abbiamo creato in precedenza
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px'
      });

      // Dopo il login, se ha successo...
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            console.log('Login success -> Now can proceed');
        }
      });
    }
  }
}