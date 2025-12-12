import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MockBackend } from '../../services/mock-backend';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class ProductsComponent {
  products: any[] = [];

  constructor(private backend: MockBackend) {
    this.products = backend.getProducts();
  }
}
