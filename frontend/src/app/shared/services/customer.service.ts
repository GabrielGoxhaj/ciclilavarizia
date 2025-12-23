import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Address, CreateAddressRequest } from '../models/address.model';
import { Customer, CustomerCreateRequest, CustomerUpdateRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/customers`;

  // user:
  // GET: api/Customers/my-addresses
  getMyAddresses(): Observable<ApiResponse<Address[]>> {
    return this.http.get<ApiResponse<Address[]>>(`${this.baseUrl}/my-addresses`);
  }

  createAddress(address: CreateAddressRequest): Observable<ApiResponse<Address>> {
    // Nota: baseUrl include già /customers, quindi aggiungiamo solo /addresses
    return this.http.post<ApiResponse<Address>>(`${this.baseUrl}/addresses`, address);
  }

  // admin:
  // GET: api/Customers (Paginato)
  getAllCustomers(page: number = 1, pageSize: number = 20): Observable<ApiResponse<Customer[]>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<ApiResponse<Customer[]>>(this.baseUrl, { params });
  }

  // GET: api/Customers/{id}
  getCustomerById(id: number): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(`${this.baseUrl}/${id}`);
  }

  // POST: api/Customers ... Il cliente creato non potrà fare il login perché non crea credenziali su Db Auth, solo per anagrafiche per scopi interni.
  createCustomer(data: CustomerCreateRequest): Observable<ApiResponse<Customer>> {
    return this.http.post<ApiResponse<Customer>>(this.baseUrl, data);
  }

  // PUT: api/Customers/{id} : TODO - integrare con AccountManager
  updateCustomer(id: number, data: CustomerUpdateRequest): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(`${this.baseUrl}/${id}`, data);
  }

  // DELETE: api/Customers/{id} : TODO - integrare con AccountManager
  deleteCustomer(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${id}`);
  }
}