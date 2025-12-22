import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  CustomerRegistrationRequest,
  UserLoginRequest,
  UserMe,
} from '../models/auth.model';
import { tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<AuthResponse | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  currentRole = computed(() => this.currentUser()?.role);

  constructor() {
    this.restoreSession();
  }

  private restoreSession() {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_info');

    if (storedToken && storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: UserLoginRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.status === 'success' && response.data) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_info', JSON.stringify(response.data));

            this.currentUser.set(response.data);
          }
        })
      );
  }

  register(data: CustomerRegistrationRequest) {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');

    this.currentUser.set(null);

    this.router.navigate(['/']);
  }

  checkEmailAvailability(email: string) {
    // true se disponibile (non esiste), false se esiste già
    return this.http.get<boolean>(`${this.baseUrl}/auth/check-email?email=${email}`);
  }

  getMe() {
    return this.http.get<ApiResponse<UserMe>>(`${this.baseUrl}/auth/me`).pipe(
      tap((response) => {
        // Es: this.currentUser.update(prev => ({...prev, ...response.data}))
      })
    );
  }
}
