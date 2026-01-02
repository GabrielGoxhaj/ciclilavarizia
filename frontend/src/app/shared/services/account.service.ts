import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ChangePasswordRequest, UpdateProfileRequest, UserProfile } from '../models/account.model';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // https://localhost:7061/api

  // GET: api/account/profile
  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.baseUrl}/account/profile`);
  }
  // PUT: api/account/profile
  updateProfile(data: UpdateProfileRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/account/profile`, data);
  }
  // POST: api/account/change-password
  changePassword(data: ChangePasswordRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/account/change-password`, data);
  }

  // GET /api/account/addresses
  getAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.baseUrl}/account/addresses`);
  }
  // POST /api/account/addresses
  addAddress(data: Address): Observable<ApiResponse<Address>> {
    return this.http.post<ApiResponse<Address>>(`${this.baseUrl}/account/addresses`, data);
  }
  // PUT /api/account/addresses/{id}
  updateAddress(id: number, data: Address): Observable<ApiResponse<Address>> {
    return this.http.put<ApiResponse<Address>>(`${this.baseUrl}/account/addresses/${id}`, data);
  }
  // DELETE /api/account/addresses/{id}
  deleteAddress(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/account/addresses/${id}`);
  }
}
