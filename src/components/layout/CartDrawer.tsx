import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, whatsappLink, cartWhatsAppMessage } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer = () => {
  const { items, total, isOpen, setIsOpen, updateQuantity, removeFromCart } = useCart();
  const shipping = total > 2500 ? 0 : 199;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#111111] z-[70] flex flex-col border-l border-white/8"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-crown-gold" />
                <h2 className="font-display text-[18px] tracking-wide text-white">
                  Your Bag
                  <span className="ml-2 text-[13px] font-sans font-normal text-white/40">({items.length})</span>
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-auto py-6 px-6 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-5">
                    <ShoppingBag size={22} strokeWidth={1} className="text-white/30" />
                  </div>
                  <p className="font-display text-[20px] text-white/70">Empty Bag</p>
                  <p className="text-[12px] text-white/30 mt-2 tracking-wide">Add ROOH fragrances to experience luxury</p>
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className="mt-8 bg-crown-gold text-[#0A0A0A] px-8 py-3 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                items.map(item => {
                  const img = item.product.images.find(i => i.isMain) || item.product.images[0];
                  return (
                    <div key={item.product.id} className="flex gap-4 group">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="w-[76px] h-[90px] bg-[#1A1A1A] flex-shrink-0 overflow-hidden"
                      >
                        <img src={img.url} alt={item.product.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="font-display text-[13px] text-white hover:text-crown-gold transition-colors uppercase tracking-wide block truncate"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-white/35 mt-1 line-clamp-1">{item.product.shortDescription}</p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty controls */}
                          <div className="flex items-center border border-white/15">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-7 text-center text-[12px] text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span className="text-[13px] font-semibold text-crown-gold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[9px] tracking-[0.2em] uppercase text-white/25 hover:text-white/60 mt-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-white/8 space-y-4 bg-[#0E0E0E]">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-crown-gold text-[11px] uppercase tracking-wider' : 'text-white'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-white/8 pt-2 text-white">
                    <span>Total</span>
                    <span>{formatPrice(total + shipping)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-crown-gold text-[#0A0A0A] text-center py-4 text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
                >
                  Checkout — COD Available
                </Link>
                <a
                  href={whatsappLink(cartWhatsAppMessage(items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })), total))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-[#25D366] text-[#25D366] text-center py-3.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  Order on WhatsApp
                </a>
                <p className="text-[9px] tracking-[0.2em] uppercase text-white/20 text-center">
                  Secure · COD · Nationwide Delivery
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
