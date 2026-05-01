import { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';

export const usePricingConfig = (productId, startDate, endDate, quantity) => {
  const [calculation, setCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Cache to avoid identical requests immediately after each other
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!productId || !startDate || !endDate) return;

    // Generate unique caching key
    const cacheKey = `${productId}-${startDate}-${endDate}-${quantity}`;
    
    // Check Cache first before triggering loader
    if (cacheRef.current.has(cacheKey)) {
      setCalculation(cacheRef.current.get(cacheKey));
      return;
    }

    setIsCalculating(true);
    let isMounted = true;

    // Debounce the actual fetch
    const timeoutId = setTimeout(async () => {
      try {
        const result = await productService.calculateCost(productId, { startDate, endDate, quantity });
        
        if (isMounted) {
          cacheRef.current.set(cacheKey, result);
          setCalculation(result);
        }
      } catch (err) {
         console.error("Pricing Engine Error:", err);
      } finally {
        if (isMounted) {
          setIsCalculating(false);
        }
      }
    }, 300); // 300ms Debounce standard

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [productId, startDate, endDate, quantity]);

  return { calculation, isCalculating };
};
