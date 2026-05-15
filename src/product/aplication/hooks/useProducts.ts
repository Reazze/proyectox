import { useEffect, useMemo, useState } from "react";
import { ProductApi } from "../../infraestructure/api/productApi";
import type { Product, ProductFilters } from "../../domain/entities/Product";

const PAGE_SIZE = 25;

export const useProducts = (page: number, filters: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const api = useMemo(() => new ProductApi(), []);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.getProducts(page, PAGE_SIZE, filters);

        if (!active) return;

        setProducts(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error cargando productos.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [api, page, filters.categoria, filters.search]);

  const decreaseStock = (productId: number, quantity: number) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(product.stock - quantity, 0) }
          : product
      )
    );
  };

  return { products, loading, error, total, totalPages, limit: PAGE_SIZE, decreaseStock };
};
