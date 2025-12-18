import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  CustomerRegistrationRequest,
  UserLoginRequest,
  UserMe,
} from '../models/auth.model';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // riavvio della pagina: controlla se c'è un token e prova a fare ripristino dello stato
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_info');
    if (storedToken && storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: UserLoginRequest) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.status === 'success' && response.data) {
            localStorage.setItem('auth_token', response.data.token); // salvataggio token in localStorage per interceptor
            // salva dati utente per UI in localStorage per persistenza in caso di refresh
            localStorage.setItem('user_info', JSON.stringify(response.data));
            this.currentUserSubject.next(response.data); // notifica app che utente è loggato
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
    this.currentUserSubject.next(null);
    // redirect alla home?
  }

  getMe() {  // informazioni utente loggato
    return this.http.get<ApiResponse<UserMe>>(`${this.baseUrl}/auth/me`);
  }

  // metodi helper:
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentRole(): string | undefined {
    return this.currentUserSubject.value?.role;
  }
}
