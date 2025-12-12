import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  categories = [
    {
      id: 'cross-country',
      name: 'Cross-country',
      description: 'Biciclette leggere e veloci per percorsi lunghi',
      image: 'https://via.placeholder.com/300x200?text=Cross-country'
    },
    {
      id: 'trail',
      name: 'Trail',
      description: 'Versatili e agili per terreni vari',
      image: 'https://via.placeholder.com/300x200?text=Trail'
    },
    {
      id: 'enduro',
      name: 'Enduro',
      description: 'Robuste per discese e salite impegnative',
      image: 'https://via.placeholder.com/300x200?text=Enduro'
    },
    {
      id: 'ebike',
      name: 'E-bike',
      description: 'Con motore elettrico per lunghe distanze',
      image: 'https://via.placeholder.com/300x200?text=E-bike'
    }
  ];

  featuredProducts = [
    {
      id: 1,
      name: 'Trail Hunter',
      category: 'Trail',
      price: 1299,
      image: 'https://via.placeholder.com/400x300?text=Trail+Hunter',
      description: 'Bicicletta trail di alta qualità con sospensioni avanzate'
    },
    {
      id: 2,
      name: 'Enduro Pro',
      category: 'Enduro',
      price: 1899,
      image: 'https://via.placeholder.com/400x300?text=Enduro+Pro',
      description: 'Perfetta per le descese più tecniche e impegnative'
    }
  ];
}
