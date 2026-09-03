import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product, WishlistItem } from '../types';

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed parsing wishlist state from localStorage:', err);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tcv_wishlist', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed saving wishlist state to localStorage:', err);
    }
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(prev => {
      if (!prev.some(i => i.product.id === product.id)) {
        return [...prev, { product, addedAt: new Date().toISOString() }];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const isInWishlist = (productId: string) => items.some(i => i.product.id === productId);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
