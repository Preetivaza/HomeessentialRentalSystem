import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart';

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStoredCart());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, config) => {
    const id = product?._id || product?.id;
    if (!id) return;

    const startDate = config?.startDate || null;
    const endDate = config?.endDate || null;
    const quantity = Number(config?.quantity || 1);

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (x) => x.productId === id && x.startDate === startDate && x.endDate === endDate
      );

      const nextItem = {
        productId: id,
        name: product.name,
        image: product.images?.[0] || product.image,
        category: product.category,
        pricePerDay: product.pricePerDay || product.price,
        securityDeposit: product.securityDeposit || 0,
        startDate,
        endDate,
        quantity,
      };

      if (existingIdx === -1) return [...prev, nextItem];

      const copy = [...prev];
      copy[existingIdx] = {
        ...copy[existingIdx],
        quantity: Math.min((product.stock || Infinity), copy[existingIdx].quantity + quantity),
      };
      return copy;
    });
  };

  const removeItem = (productId, startDate, endDate) => {
    setItems((prev) => prev.filter((x) => !(x.productId === productId && x.startDate === startDate && x.endDate === endDate)));
  };

  const updateQuantity = (productId, startDate, endDate, nextQuantity) => {
    const qty = Math.max(1, Number(nextQuantity || 1));
    setItems((prev) =>
      prev.map((x) =>
        x.productId === productId && x.startDate === startDate && x.endDate === endDate ? { ...x, quantity: qty } : x
      )
    );
  };

  const clearCart = () => setItems([]);

  const getDurationDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const duration = Math.ceil((end - start) / 86400000);
    return Math.max(duration, 0);
  };

  const getItemSubtotal = (item) => {
    const days = getDurationDays(item.startDate, item.endDate);
    return (item.pricePerDay || 0) * days * (item.quantity || 1);
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + getItemSubtotal(item), 0);

    const tax = subtotal * 0.18;
    const deliveryFee = 0;
    const total = subtotal + tax + deliveryFee;

    return { subtotal, tax, deliveryFee, total };
  }, [items]);

  const value = {
    items,
    setItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getDurationDays,
    getItemSubtotal,
    count: items.reduce((sum, x) => sum + (x.quantity || 0), 0),
    totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

