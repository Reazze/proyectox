import type {
  Category,
  Product,
  ProductFilters,
  ProductPage,
} from "../../domain/entities/Product";
import { getToken } from "../../../auth/infraestructure/authStorage";

const baseUrl = "http://localhost:8000";

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export class ProductApi {
  async getProducts(
    page = 1,
    limit = 25,
    filters: ProductFilters = {}
  ): Promise<ProductPage> {
    const query = buildQuery({
      page,
      limit,
      categoria: filters.categoria,
      search: filters.search,
    });

    const response = await fetch(`${baseUrl}/productos?${query}`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos.");
    }

    const json = await response.json();

    return {
      data: json.data,
      total: json.total,
      page: json.page,
      limit: json.limit,
      totalPages: json.totalPages,
    };
  }

  async getBestSellers(limit = 4): Promise<Product[]> {
    const response = await fetch(`${baseUrl}/productos/mas-vendidos?limit=${limit}`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar los productos más vendidos.");
    }
    const json = await response.json();
    return json.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${baseUrl}/categorias`);
    if (!response.ok) {
      throw new Error("No se pudieron cargar las categorías.");
    }
    const json = await response.json();
    return json.data;
  }

  async addToCart(productId: number, quantity = 1): Promise<void> {
    const token = getToken();

    if (!token) {
      throw new Error("Necesitas iniciar sesión para agregar al carrito.");
    }

    const response = await fetch(`${baseUrl}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message ?? "No se pudo agregar el producto al carrito.");
    }
  }
}
