import { useState } from "react";
import type { Product } from "../domain/entities/Product";

type Props = {
  product: Product;
  onAddToCart: (id: number, quantity: number) => void;
  disabled?: boolean;
};

const ProductCard = ({ product, onAddToCart, disabled }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const hasDiscount = product.precio_oferta < product.precio;
  const discountPercentage = hasDiscount
    ? Math.round(((product.precio - product.precio_oferta) / product.precio) * 100)
    : 0;

  const handleQuantityChange = (value: number) => {
    const limited = Math.min(Math.max(1, value), product.stock || 1);
    setQuantity(limited);
  };

  return (
    <article className="card h-100 border-0 shadow-lg rounded-4 product-card">
      <div className="position-relative overflow-hidden rounded-top">
        <div className="ratio ratio-4x3">
          <img
            src={product.image}
            alt={product.nombre}
            className="img-fluid h-100 w-100 object-fit-cover"
          />
        </div>

        {hasDiscount && (
          <div className="position-absolute top-0 start-0 m-3">
            <span className="badge bg-danger fs-6 px-3 py-2 shadow-sm">
              -{discountPercentage}%
            </span>
          </div>
        )}

        <div className="position-absolute bottom-0 start-0 end-0 gradient-overlay"></div>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="mb-3 d-flex flex-wrap gap-2">
          {product.categorias.slice(0, 2).map((categoria) => (
            <span key={categoria} className="badge bg-light text-dark rounded-pill small px-3 py-2">
              {categoria}
            </span>
          ))}
        </div>

        <h3 className="h6 card-title mb-2 line-clamp-2" style={{ minHeight: "2.5rem" }}>
          {product.nombre}
        </h3>

        <p className="card-text text-muted small mb-4 line-clamp-2" style={{ minHeight: "2.5rem" }}>
          {product.descripcion}
        </p>

        <div className="mt-auto">
          <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
            <div>
              <span className="text-muted small d-block">Precio</span>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-primary fs-5">
                  ${product.precio_oferta.toFixed(2)}
                </span>
                {hasDiscount && (
                  <small className="text-muted text-decoration-line-through">
                    ${product.precio.toFixed(2)}
                  </small>
                )}
              </div>
            </div>
            <div className="text-end">
              <small className="text-muted d-block">{product.ventas > 0 ? `${product.ventas} vendidos` : "Nuevo"}</small>
              <small className={product.stock > 0 ? "text-success" : "text-danger"}>
                {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="form-floating flex-grow-1">
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(event) => handleQuantityChange(Number(event.target.value))}
                className="form-control form-control-sm rounded-pill"
                disabled={product.stock === 0}
                id={`quantity-${product.id}`}
              />
              <label htmlFor={`quantity-${product.id}`} className="small text-muted">
                Cantidad
              </label>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-4 py-2"
              onClick={() => onAddToCart(product.id, quantity)}
              disabled={disabled || product.stock === 0}
            >
              <i className="bi bi-cart-plus me-1"></i>
              Añadir
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
