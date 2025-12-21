import { Address } from './address.model';
import { Order } from './order.model'; 

export interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  orders?: Order[];
}

export interface CustomerCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CustomerUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}