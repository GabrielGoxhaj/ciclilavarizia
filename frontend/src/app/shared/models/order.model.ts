export interface CreateOrderDetail {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
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

export interface Order {
  salesOrderId: number;
  customerId: number;
  orderDate: string;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  orderDetails: OrderDetail[];
}