export interface CartItem {
    productId: number;
    name: string;
    listPrice: number;
    quantity: number;
    thumbnailUrl?: string;
}

export interface CartSummary {
    items: CartItem[];
    totalAmount: number;
    totalQuantity: number;
}