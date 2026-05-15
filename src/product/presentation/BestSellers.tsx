import ProductCard from "./ProductCard";
import type { Product } from "../domain/entities/Product";

type Props = {
  items: Product[];
  onAddToCart: (id: number, quantity: number) => void;
  loading: boolean;
  error: string | null;
  title?: string;
};

const BestSellers = ({ items, onAddToCart, loading, error, title = "Productos más vendidos" }: Props) => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h3 fw-bold mb-1">{title}</h2>
            <p className="text-muted mb-0">Los favoritos del momento, seleccionados para ti.</p>
          </div>
          <div>
            <span className="badge bg-primary px-3 py-2">Recomendado</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="product-grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
