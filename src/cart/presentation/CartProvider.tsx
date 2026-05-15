import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../../auth/presentation/useAuth";
import { CartApi } from "../infraestructure/api/cartApi";
import CartSidebar from "./CartSidebar";
import type { CartItem } from "../domain/entities/Cart";

export type CartContextType = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  open: boolean;
  cartCount: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const cartApi = useMemo(() => new CartApi(), []);
  const { user, openLoginModal } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.precio_oferta * item.quantity,
    0
  );

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cartItems = await cartApi.getCart();
      setItems(cartItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    void refreshCart();
  }, [user]);

  const openCart = () => setOpen(true);
  const closeCart = () => setOpen(false);
  const toggleCart = () => setOpen((current) => !current);

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      openLoginModal();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await cartApi.addItem(productId, quantity);
      await refreshCart();
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo agregar el producto al carrito.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      await cartApi.updateItem(productId, quantity);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la cantidad.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    setLoading(true);
    setError(null);

    try {
      await cartApi.removeItem(productId);
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el producto.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);

    try {
      await cartApi.clearCart();
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo vaciar el carrito.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        open,
        cartCount,
        totalPrice,
        openCart,
        closeCart,
        toggleCart,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
      <CartSidebar
        open={open}
        onClose={closeCart}
        items={items}
        loading={loading}
        error={error}
        cartCount={cartCount}
        totalPrice={totalPrice}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />
    </CartContext.Provider>
  );
};

export default CartProvider;
