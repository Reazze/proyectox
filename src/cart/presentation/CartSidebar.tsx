import type { CartItem } from "../domain/entities/Cart";

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  loading: boolean;
  error: string | null;
  cartCount: number;
  totalPrice: number;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartSidebar = ({
  open,
  onClose,
  items,
  loading,
  error,
  cartCount,
  totalPrice,
  updateQuantity,
  removeItem,
  clearCart,
}: Props) => {
  const hasItems = items.length > 0;

  return (
    <div className={`cart-sidebar ${open ? "active" : ""}`} aria-hidden={!open}>
      <div className="cart-sidebar-backdrop" onClick={onClose} />
      <aside className="cart-sidebar-panel shadow-lg" role="dialog" aria-modal="true">
        <div className="d-flex align-items-start justify-content-between mb-4">
          <div>
            <p className="text-uppercase text-muted mb-1 small">Tu carrito</p>
            <h2 className="h5 mb-0">Resumen de compra</h2>
            <p className="text-muted small mb-0">{cartCount} artículo{cartCount === 1 ? "" : "s"}</p>
          </div>
          <button type="button" className="btn-close" aria-label="Cerrar carrito" onClick={onClose} />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando carrito...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : !hasItems ? (
          <div className="text-center py-5">
            <div className="mb-3 display-6 text-secondary">🛒</div>
            <h3 className="h6">Tu carrito está vacío</h3>
            <p className="text-muted">Agrega productos y regresa para finalizar tu compra.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            <div className="cart-items-list">
              {items.map((item) => {
                const maxQuantity = item.quantity + item.product.stock;
                return (
                  <article key={item.product.id} className="cart-item d-flex gap-3 pb-3 border-bottom">
                    <img
                      src={item.product.image}
                      alt={item.product.nombre}
                      className="rounded-3"
                      style={{ width: 84, height: 84, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1 d-flex flex-column justify-content-between">
                      <div>
                        <h3 className="h6 mb-1">{item.product.nombre}</h3>
                        <p className="text-muted small mb-2">{item.product.categorias.join(" · ")}</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <div className="input-group input-group-sm cart-quantity-control">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min={1}
                            max={maxQuantity}
                            onChange={(event) => {
                              const value = Number(event.target.value) || 1;
                              const nextQuantity = Math.min(Math.max(value, 1), maxQuantity);
                              updateQuantity(item.product.id, nextQuantity);
                            }}
                            aria-label={`Cantidad de ${item.product.nombre}`}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.product.id, Math.min(maxQuantity, item.quantity + 1))}
                            disabled={item.quantity >= maxQuantity}
                          >
                            +
                          </button>
                        </div>
                        <div className="text-end">
                          <div className="fw-semibold">${(item.product.precio_oferta * item.quantity).toFixed(2)}</div>
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-danger px-0"
                            onClick={() => removeItem(item.product.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="border-top pt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Subtotal</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <p className="text-muted small mb-4">Los impuestos se calcularán en el siguiente paso.</p>
              <div className="d-flex gap-2 flex-column">
                <button type="button" className="btn btn-primary btn-lg w-100">
                  Continuar con la compra
                </button>
                <button type="button" className="btn btn-outline-secondary w-100" onClick={clearCart}>
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartSidebar;
