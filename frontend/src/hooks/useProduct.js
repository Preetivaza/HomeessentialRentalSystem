import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { toast } from 'react-toastify';

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProduct(id, { signal: controller.signal });
        setProduct(data?.data?.product || data?.product || data);
        setError(null);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.message || 'Failed to load product');
          toast.error('Failed to load product data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { product, isLoading, error };
};
