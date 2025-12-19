import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AddressDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; 

  // POST: api/Orders
  createOrder(request: CreateOrderRequest): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/orders`, request);
  }

  // GET: api/Orders/my
  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.baseUrl}/orders/my`);
  }

  // GET: api/Orders/my/{id}
  getOrderById(orderId: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/orders/my/${orderId}`);
  }

  // GET: api/Customers/my-addresses
  getMyAddresses(): Observable<ApiResponse<AddressDto[]>> {
  return this.http.get<ApiResponse<AddressDto[]>>(`${this.baseUrl}/customers/my-addresses`);
}
}
