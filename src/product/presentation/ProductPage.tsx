import { useEffect, useState, useRef, type FormEvent } from "react";
import { useAuth } from "../../auth/presentation/useAuth";
import { useCart } from "../../cart/presentation/useCart";
import { useCategories } from "../aplication/hooks/useCategories";
import { useBestSellers } from "../aplication/hooks/useBestSellers";
import { useProducts } from "../aplication/hooks/useProducts";
import ProductCard from "./ProductCard";
import BestSellers from "./BestSellers";
import HeroCanvas from "../../components/widgets/hero";

const ProductPage = () => {
  const { user, openLoginModal } = useAuth();
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const { addToCart: addToCartToCart, openCart } = useCart();
  const { products, loading, error, totalPages, total, decreaseStock } = useProducts(page, {
    categoria,
    search: searchTerm,
  });
  const { bestSellers, loading: loadingBest, error: errorBest } = useBestSellers(4);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (message || status) {
      const timeout = window.setTimeout(() => {
        setMessage(null);
        setStatus(null);
      }, 3000);

      return () => window.clearTimeout(timeout);
    }
  }, [message, status]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
      canvas.height = 220;
    };

    const draw = () => {
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      time += 0.012;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(13, 110, 253, 0.12)");
      gradient.addColorStop(1, "rgba(56, 189, 248, 0.06)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.65, 54 + Math.sin(time) * 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.78, height * 0.35, 36 + Math.cos(time * 1.4) * 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.14)";
      ctx.fill();

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearchTerm(searchValue.trim());
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSearchTerm("");
    setCategoria("");
    setPage(1);
  };

  const handleAddToCart = async (productId: number, quantity: number) => {
    if (!user) {
      openLoginModal();
      return;
    }

    try {
      await addToCartToCart(productId, quantity);
      decreaseStock(productId, quantity);
      openCart();
      setStatus("Producto agregado al carrito con éxito.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error agregando el producto al carrito.");
    }
  };

  const pages = Array.from(
    { length: Math.max(1, totalPages) },
    (_, index) => index + 1
  ).filter((pageNumber) =>
    Math.abs(pageNumber - page) <= 4 || pageNumber === 1 || pageNumber === totalPages
  );

  return (
    <main>
        <HeroCanvas title="Productos" subtitle="Encuentra lo que buscas" />
      <section className="container py-5">
        <div className="d-flex d-lg-none justify-content-end mb-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setFiltersOpen((current) => !current)}
          >
            {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
          </button>
        </div>

        <div className={`filter-backdrop ${filtersOpen ? "active" : ""}`} onClick={() => setFiltersOpen(false)} />

        <div className="row gy-4">
          <aside className="col-lg-3">
            <div className={`card border-0 shadow-sm p-4 filter-panel ${filtersOpen ? "open" : ""} ${filtersOpen ? "d-block" : "d-none d-lg-block"}`}> 
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h4 className="h6 mb-1">Filtrar productos</h4>
                  <p className="text-muted small mb-0">Encuentra lo que buscas con resultados limpios y rápidos.</p>
                </div>
                <button
                  type="button"
                  className="btn-close d-lg-none"
                  aria-label="Cerrar filtros"
                  onClick={() => setFiltersOpen(false)}
                />
              </div>
              <form onSubmit={handleApplyFilters} className="d-flex flex-column gap-3">
                <div>
                  <label htmlFor="searchInput" className="form-label">Buscar</label>
                  <input
                    id="searchInput"
                    type="search"
                    className="form-control"
                    placeholder="Nombre, SKU o descripción"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="categorySelect" className="form-label">Categoría</label>
                  <select
                    id="categorySelect"
                    className="form-select"
                    value={categoria}
                    onChange={(event) => {
                      setCategoria(event.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">Todas</option>
                    {categoriesLoading ? (
                      <option disabled>Cargando categorías...</option>
                    ) : categoriesError ? (
                      <option disabled>Error cargando</option>
                    ) : (
                      categories.flatMap((categoryValue) => [
                        <option key={categoryValue.id} value={categoryValue.nombre}>
                          {categoryValue.nombre}
                        </option>,
                        ...(categoryValue.children ?? []).map((child) => (
                          <option key={child.id} value={child.nombre}>
                            └ {child.nombre}
                          </option>
                        )),
                      ])
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="sortSelect" className="form-label">Ordenar por</label>
                  <select id="sortSelect" className="form-select" disabled>
                    <option>Más relevantes</option>
                    <option>Más vendidos</option>
                    <option>Precio: menor a mayor</option>
                    <option>Precio: mayor a menor</option>
                  </select>
                  <small className="text-muted">Próximamente</small>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Aplicar
                  </button>
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
                    Reiniciar
                  </button>
                </div>
              </form>
            </div>
          </aside>

          <div className="col-lg-9">
            {status && <div className="alert alert-success">{status}</div>}
            {message && <div className="alert alert-danger">{message}</div>}

            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
              <div>
                <h2 className="h4 mb-0">Resultados</h2>
                <p className="text-muted mb-0">{total} productos encontrados</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando productos...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} disabled={false} />
                ))}
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 mt-5">
              <div className="text-muted">Página {page} de {totalPages}</div>
              <nav aria-label="Paginación de productos">
                <ul className="pagination mb-0">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" type="button" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      Anterior
                    </button>
                  </li>
                  {pages.map((pageNumber) => {
                    const shouldHide =
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      Math.abs(pageNumber - page) > 2;

                    return (
                      <li key={pageNumber} className={`page-item ${pageNumber === page ? "active" : ""} ${shouldHide ? "d-none d-md-block" : ""}`}>
                        <button className="page-link" type="button" onClick={() => setPage(pageNumber)}>
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" type="button" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                      Siguiente
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <BestSellers items={bestSellers} onAddToCart={handleAddToCart} loading={loadingBest} error={errorBest} title="Lo más vendido" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
