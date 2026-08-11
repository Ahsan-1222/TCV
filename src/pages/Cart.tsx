import { useCart } from '../context/CartContext';
import { formatPrice, whatsappLink, cartWhatsAppMessage } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const shipping = total > 2500 ? 0 : 199;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-5 mx-auto">
            <ShoppingBag size={22} strokeWidth={1} className="text-white/20" />
          </div>
          <h1 className="font-display text-[32px] text-white/60">Your Bag is Empty</h1>
          <p className="text-[12px] text-white/25 mt-2">Add ROOH fragrances to get started</p>
          <Link
            to="/shop"
            className="mt-7 inline-flex bg-crown-gold text-[#0A0A0A] px-8 py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-14">
        <div className="mb-8 border-b border-white/8 pb-5">
          <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-2">Review Items</div>
          <h1 className="font-display text-[32px] sm:text-[42px] leading-none text-white">Shopping Bag</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Items */}
          <div className="space-y-3">
            {items.map(item => {
              const img = item.product.images.find(i => i.isMain) || item.product.images[0];
              return (
                <div key={item.product.id} className="flex gap-4 border border-white/8 bg-[#111111] p-4">
                  <Link to={`/product/${item.product.slug}`} className="w-20 h-24 sm:w-24 sm:h-28 bg-[#1A1A1A] flex-shrink-0 overflow-hidden">
                    <img src={img.url} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-display uppercase tracking-wide text-[13px] sm:text-[15px] text-white hover:text-crown-gold transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-white/25 hover:text-white transition-colors shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-white/30 mt-1 line-clamp-1">{item.product.shortDescription}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/15">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center text-[12px] text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="font-semibold text-[13px] text-crown-gold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-[#111111] border border-white/8 p-6 md:p-8 h-fit lg:sticky lg:top-28 space-y-5">
            <h3 className="font-display text-[20px] text-white">Order Summary</h3>
            <div className="space-y-3 text-[13px]">
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
              {shipping > 0 && (
                <p className="text-[10px] text-crown-gold/60 uppercase tracking-wider">
                  Add {formatPrice(2500 - total)} more for free shipping
                </p>
              )}
              <div className="flex justify-between font-semibold text-[15px] border-t border-white/8 pt-3 text-white">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <Link
                to="/checkout"
                className="block bg-crown-gold text-[#0A0A0A] text-center py-4 text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
              >
                Checkout — COD Available
              </Link>
              <a
                href={whatsappLink(cartWhatsAppMessage(items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })), grandTotal))}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-[#25D366]/40 text-[#25D366] text-center py-3.5 text-[10px] tracking-[0.2em] uppercase hover:bg-[#25D366]/10 transition-colors"
              >
                Order via WhatsApp
              </a>
            </div>
            <p className="text-[9px] uppercase tracking-widest text-white/20 text-center">
              COD · Secure · Nationwide Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
