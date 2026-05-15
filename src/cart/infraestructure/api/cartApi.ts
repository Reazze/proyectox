import type { CartItem, CartResponse } from "../domain/entities/Cart";
import { getToken } from "../../../auth/infraestructure/authStorage";

const baseUrl = "http://localhost:8000";

export class CartApi {
  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message ?? "Error en el servidor del carrito.");
    }

    return response.json() as Promise<CartResponse>;
  }

  async getCart(): Promise<CartItem[]> {
    const token = getToken();
    if (!token) return [];

    const response = await fetch(`${baseUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await this.handleResponse(response);
    return json.data;
  }

  async addItem(productId: number, quantity: number): Promise<CartItem[]> {
    const token = getToken();
    if (!token) throw new Error("Necesitas iniciar sesión para agregar al carrito.");

    const response = await fetch(`${baseUrl}/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const json = await this.handleResponse(response);
    return json.data;
  }

  async updateItem(productId: number, quantity: number): Promise<CartItem[]> {
    const token = getToken();
    if (!token) throw new Error("Necesitas iniciar sesión para actualizar el carrito.");

    const response = await fetch(`${baseUrl}/cart/items/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const json = await this.handleResponse(response);
    return json.data;
  }

  async removeItem(productId: number): Promise<CartItem[]> {
    const token = getToken();
    if (!token) throw new Error("Necesitas iniciar sesión para eliminar un producto del carrito.");

    const response = await fetch(`${baseUrl}/cart/items/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await this.handleResponse(response);
    return json.data;
  }

  async clearCart(): Promise<CartItem[]> {
    const token = getToken();
    if (!token) throw new Error("Necesitas iniciar sesión para vaciar el carrito.");

    const response = await fetch(`${baseUrl}/cart/clear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await this.handleResponse(response);
    return json.data;
  }
}
