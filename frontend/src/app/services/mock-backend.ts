import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockBackend {
  private products = [
    {
      id: 1,
      name: 'Trail Hunter',
      category: 'Trail',
      price: 1299,
      description: 'MTB di qualità con sospensioni avanzate',
      image: '',
      stock: 10,
    },
    {
      id: 2,
      name: 'Enduro Pro',
      category: 'Enduro',
      price: 1899,
      description: 'Perfetta per discese ripide, robusta e ingegnerizzata',
      image: '',
      stock: 5,
    },
  ];

  private users = [
    {
      id: 1,
      email: 'claudio.orloffo@example.com',
      password: 'password123',
      name: 'Claudio Orloffo',
    },
  ];

  getProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find((p) => p.id === id);
  }

  login(email: string, password: string) {
    return this.users.find((u) => u.email === email && u.password === password);
  }
}
