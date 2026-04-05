export type UserRole = 'consumer' | 'store' | 'delivery';

export interface UserMetadata {
  role: UserRole;
  name?: string;
  address?: string;
  storeName?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  metadata: Partial<UserMetadata>;
}

export interface Store {
  id: string;
  user_id: string;
  name: string;
  is_open: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  delivery_id: string | null;
  status: 'pendiente' | 'aceptada' | 'entregada';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
}

export interface OrderRejection {
  order_id: string;
  delivery_id: string;
  rejected_at: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  address?: string;
  storeName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateStoreDTO {
  name: string;
}

export interface CreateProductDTO {
  name: string;
  price: number;
}

export interface CreateOrderDTO {
  store_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface UpdateOrderStatusDTO {
  status: 'aceptada' | 'entregada';
}
