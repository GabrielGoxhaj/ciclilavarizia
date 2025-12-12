import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MockBackend } from '../../services/mock-backend';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetailComponent {
  product: any;

  constructor(private route: ActivatedRoute, private backend: MockBackend) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = backend.getProductById(id);
  }
}
