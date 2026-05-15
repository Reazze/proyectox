import { useEffect, useMemo, useState } from "react";
import { ProductApi } from "../../infraestructure/api/productApi";
import type { Product } from "../../domain/entities/Product";

export const useBestSellers = (limit = 4) => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => new ProductApi(), []);

  useEffect(() => {
    let active = true;

    const fetchBestSellers = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.getBestSellers(limit);

        if (!active) return;

        setBestSellers(result);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error cargando los más vendidos.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBestSellers();

    return () => {
      active = false;
    };
  }, [api, limit]);

  return { bestSellers, loading, error };
};
