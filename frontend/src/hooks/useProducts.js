import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { productService } from '../services/productService';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = useMemo(() => JSON.stringify(filters || {}), [filters]);
  const lastControllerRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    if (lastControllerRef.current) lastControllerRef.current.abort();
    const controller = new AbortController();
    lastControllerRef.current = controller;

    try {
      setIsLoading(true);
      const data = await productService.getProducts(filters, { signal: controller.signal });
      const list = data?.data?.products || data?.products || [];
      setProducts(list);
      setError(null);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.message || 'Failed to load products');
      }
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
    return () => {
      if (lastControllerRef.current) lastControllerRef.current.abort();
    };
  }, [fetchProducts]);

  const createProduct = useCallback(async (payload) => {
    const result = await productService.createProduct(payload);
    await fetchProducts();
    return result;
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id, payload) => {
    const result = await productService.updateProduct(id, payload);
    setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, ...payload } : p)));
    return result;
  }, []);

  return { products, setProducts, isLoading, error, refetch: fetchProducts, createProduct, updateProduct };
};

