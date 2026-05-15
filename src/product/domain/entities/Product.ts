export interface Product {
  id: number;
  nombre: string;
  image: string;
  descripcion: string;
  precio: number;
  precio_oferta: number;
  categorias: string[];
  sku: string;
  stock: number;
  ventas: number;
}

export interface ProductFilters {
  categoria?: string;
  search?: string;
}

export interface ProductPage {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Category {
  id: number;
  nombre: string;
  children?: Category[];
}
