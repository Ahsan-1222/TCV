import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedImage?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed parsing cart state from localStorage:', err);
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('tcv_cart', JSON.stringify(items));
    } catch (err) {
      console.warn('Failed saving cart state to localStorage:', err);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedImage?: string) => {
    const defaultImage = (product.images.find(i => i.isMain) || product.images[0])?.url;
    const color = selectedColor || (product.images[0]?.color ? product.images[0].color : undefined);
    const imgUrl = selectedImage || defaultImage;

    const maxStock = typeof product.stock === 'number' && product.stock > 0 ? product.stock : 99;

    setItems(prev => {
      const existingIdx = prev.findIndex(i => i.product.id === product.id && i.selectedColor === color);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const currentQty = updated[existingIdx].quantity;
        const newQty = Math.min(maxStock, currentQty + quantity);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty
        };
        return updated;
      }
      return [...prev, { product, quantity: Math.min(maxStock, quantity), selectedColor: color, selectedImage: imgUrl }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor?: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.selectedColor === selectedColor)));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
    } else {
      setItems(prev => prev.map(i => {
        if (i.product.id === productId && i.selectedColor === selectedColor) {
          const maxStock = typeof i.product.stock === 'number' && i.product.stock > 0 ? i.product.stock : 99;
          return { ...i, quantity: Math.min(maxStock, quantity) };
        }
        return i;
      }));
    }
  };

  const clearCart = () => setItems([]);
  const total = items.reduce((sum, i) => sum + (i.product.price || 0) * (i.quantity || 1), 0);
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
