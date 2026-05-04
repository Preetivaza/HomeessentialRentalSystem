import { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';

export const useRentalCalculation = (arg1, arg2, arg3, arg4) => {
  const config =
    typeof arg1 === 'object' && arg1 !== null
      ? arg1
      : { productId: arg1, startDate: arg2, endDate: arg3, quantity: arg4 };

  const productId = config.productId;
  const startDate = config.startDate;
  const endDate = config.endDate;
  const quantity = config.quantity;

  const [calculation, setCalculation] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!productId || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start || quantity < 1) {
      setCalculation(null);
      return;
    }

    const cacheKey = `${productId}-${startDate}-${endDate}-${quantity}`;
    
    if (cacheRef.current.has(cacheKey)) {
      setCalculation(cacheRef.current.get(cacheKey));
      return;
    }

    const controller = new AbortController();
    setIsCalculating(true);

    const timeoutId = setTimeout(async () => {
      try {
        const response = await productService.calculateCost(
          productId, 
          { startDate, endDate, quantity },
          { signal: controller.signal }
        );
        
        const resultData = response?.data || response;
        cacheRef.current.set(cacheKey, resultData);
        setCalculation(resultData);
      } catch (err) {
         if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
           console.error("Pricing Engine Error:", err);
         }
      } finally {
        setIsCalculating(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [productId, startDate, endDate, quantity]);

  return { calculation, isCalculating };
};
