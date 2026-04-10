export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isChecked: boolean;
}

export interface CartWeek {
  id: number;
  label: string;
  year: number;
  month: number;
  weekOfMonth: number;
  items: CartItem[];
  totalAmount: number;
  checkedAmount: number;
}

export interface CreateCartItemRequest {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateCartItemRequest {
  name?: string;
  quantity?: number;
  unitPrice?: number;
}
