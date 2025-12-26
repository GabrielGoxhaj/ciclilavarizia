import { computed, inject, Injectable, signal } from '@angular/core';
import { Product, ProductListItem } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private toastService = inject(ToastService);
  cartItems = signal<CartItem[]>([]);
  count = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.listPrice * item.quantity, 0)
  );

  constructor() {
    this.loadFromLocal();
  }

  public addToCart(product: Product | ProductListItem, quantity = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find((i) => i.productId === product.productId);

    if (existingItem) {
      this.updateQuantity(product.productId, existingItem.quantity + quantity);
      this.toastService.info(`Quantità aggiornata: ${product.name}`);
    } else {
      const newItem: CartItem = {
        productId: product.productId,
        name: product.name,
        listPrice: product.listPrice,
        quantity: quantity,
        thumbnailUrl: product.thumbnailUrl || '',
      };

      this.cartItems.update((items) => [...items, newItem]);
      this.saveToLocalStorage();
      this.toastService.success(`${product.name} aggiunto al carrello`);
    }
  }

  public updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItems.update((items) =>
      items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
    this.saveToLocalStorage();
  }

  public removeFromCart(productId: number): void {
    this.cartItems.update((items) => items.filter((i) => i.productId !== productId));
    this.saveToLocalStorage();
  }

  public clearCart(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  public clearCartOnLogout(): void {
    this.cartItems.set([]);
    localStorage.removeItem('cart');
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  private loadFromLocal(): void {
    const localString = localStorage.getItem('cart');
    if (localString) {
      try {
        const items = JSON.parse(localString) as CartItem[];
        this.cartItems.set(items);
      } catch (e) {
        console.error('Error parsing cart from localstorage', e);
        this.clearCart();
      }
    }
  }
}
