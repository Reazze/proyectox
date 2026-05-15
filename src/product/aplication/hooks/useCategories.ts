import { useEffect, useMemo, useState } from "react";
import { ProductApi } from "../../infraestructure/api/productApi";
import type { Category } from "../../domain/entities/Product";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(() => new ProductApi(), []);

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await api.getCategories();

        if (!active) return;

        setCategories(result);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Error cargando categorías.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, [api]);

  return { categories, loading, error };
};
