import { useEffect, useState } from 'react';
import { products as initial } from '../data/products';
import { subscribeProducts, getDeletedProductIds } from '../services/dbService';
import type { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedIds = getDeletedProductIds();
    try {
      const saved = localStorage.getItem('tcv_products');
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(p => !deletedIds.includes(p.id));
        }
      }
    } catch {}
    return initial.filter(p => !deletedIds.includes(p.id));
  });

  useEffect(() => {
    const unsubscribe = subscribeProducts((prods) => {
      const deletedIds = getDeletedProductIds();
      if (prods) {
        const clean = prods.filter(p => !deletedIds.includes(p.id));
        setProducts(clean);
      }
    });

    return () => unsubscribe();
  }, []);

  return products;
};
