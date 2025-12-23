import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; // <--- Import Router
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListCartItems } from '../list-cart-items/list-cart-items';
import { OrderSummary } from '../../../shared/components/order-summary/order-summary';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginComponent } from '../../../core/components/login/login';

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
  private router = inject(Router); // <--- Inject Router

  proceedToCheckout() {
    // Verifica se l'utente è loggato (isLoggedIn è un Signal, quindi usa le parentesi)
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      // Apre il modal di login
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px'
      });

      // Dopo la chiusura del login, se è andato a buon fine, vai al checkout
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            this.router.navigate(['/checkout']);
        }
      });
    }
  }
}