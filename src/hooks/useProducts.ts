import { useEffect, useState } from 'react';
import { products as initial } from '../data/products';
import type { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(initial);

  useEffect(() => {
    const saved = localStorage.getItem('tcv_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch {}
    }
  }, []);

  return products;
};
