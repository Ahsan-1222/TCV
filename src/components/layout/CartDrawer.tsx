import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, whatsappLink, cartWhatsAppMessage } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const { items, total, isOpen, setIsOpen, updateQuantity, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white z-[70] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
                <h2 className="font-display text-lg tracking-wide">Shopping Bag ({items.length})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 border flex items-center justify-center hover:bg-black hover:text-white transition-colors"><X size={14} /></button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-neutral-100 flex items-center justify-center mb-4"><ShoppingBag size={20} /></div>
                  <p className="font-display text-lg">Your bag is empty</p>
                  <p className="text-[12px] opacity-60 mt-2">Add ROOH fragrances to experience luxury</p>
                  <Link to="/shop" onClick={() => setIsOpen(false)} className="mt-6 inline-flex bg-black text-white px-6 py-3 text-[11px] tracking-widest uppercase">Continue Shopping</Link>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex gap-4">
                    <Link to={`/product/${item.product.slug}`} onClick={() => setIsOpen(false)} className="w-20 h-24 bg-[#F8F6F3] flex-shrink-0 overflow-hidden">
                      <img src={(item.product.images.find(i => i.isMain) || item.product.images[0]).url} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product.slug}`} className="font-display text-[13px] uppercase tracking-wide hover:text-crown-gold">{item.product.name}</Link>
                      <p className="text-[11px] opacity-60 mt-1">{item.product.shortDescription}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border gap-1">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Minus size={12} /></button>
                          <span className="w-8 text-center text-[12px]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Plus size={12} /></button>
                        </div>
                        <span className="text-[13px] font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] tracking-widest uppercase opacity-40 hover:opacity-100 mt-2 underline">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t bg-[#FCFBF9] space-y-4">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between"><span className="opacity-60">Subtotal</span><span className="font-medium">{formatPrice(total)}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Shipping</span><span className="text-crown-gold text-[11px] uppercase tracking-widest">Free over Rs. 2500</span></div>
                  <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Link to="/checkout" onClick={() => setIsOpen(false)} className="bg-black text-white text-center py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-crown-gold transition-colors">Checkout — COD Available</Link>
                  <a href={whatsappLink(cartWhatsAppMessage(items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })), total))} target="_blank" rel="noopener noreferrer" className="border border-[#25D366] text-[#25D366] text-center py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[#25D366] hover:text-white transition-colors">Order on WhatsApp</a>
                </div>
                <p className="text-[10px] tracking-widest uppercase opacity-40 text-center">Secure • COD • Nationwide Delivery</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
