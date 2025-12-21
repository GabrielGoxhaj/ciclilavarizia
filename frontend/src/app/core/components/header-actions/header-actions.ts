import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../../shared/services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoginComponent } from '../login/login';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header-actions',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './header-actions.html',
})
export class HeaderActionsComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  readonly dialog = inject(MatDialog);

  openLogin() {
    this.dialog.open(LoginComponent, {
      width: '400px',
      maxWidth: '90vw', 
      autoFocus: false, 
      panelClass: 'custom-dialog-container', 
    });
  }

  logout() {
    this.cartService.clearCartOnLogout();
    this.authService.logout();
  }
}
