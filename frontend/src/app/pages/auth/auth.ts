import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockBackend } from '../../services/mock-backend';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'],
})
export class AuthComponent {
  email = '';
  password = '';
  error = '';

  constructor(private backend: MockBackend) {}

  login() {
    const user = this.backend.login(this.email, this.password);
    if (user) {
      this.error = '';
      alert('Login effettuato! Benvenuto ' + user.name);
    } else {
      this.error = 'Credenziali non valide';
    }
  }
}
