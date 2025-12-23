export interface CreateOrderDetail {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  addressId: number; 
  paymentMethod?: string; 
  items: CreateOrderDetail[];
}

export interface OrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

// response
export interface Order {
  salesOrderId: number; 
  customerId: number;
  orderDate: string;
  status: number;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  orderDetails: OrderDetail[];
}