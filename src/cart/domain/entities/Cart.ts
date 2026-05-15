import type { Product } from "../../product/domain/entities/Product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data: CartItem[];
}
