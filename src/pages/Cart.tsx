import { useCart } from '../context/CartContext';
import { formatPrice, whatsappLink, cartWhatsAppMessage } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';

export const Cart = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const shipping = total > 2500 ? 0 : 199;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
        <h1 className="font-display text-[36px]">Your Bag is Empty</h1>
        <Link to="/shop" className="mt-6 inline-flex bg-black text-white px-8 py-3 text-[11px] tracking-widest uppercase">Shop Collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
      <h1 className="font-display text-[28px] md:text-[36px] leading-none">Shopping Bag</h1>
      <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 mt-8 md:mt-10">
        <div className="space-y-6">
          {items.map(item => (
            <div key={item.product.id} className="flex gap-4 md:gap-6 border p-4 bg-white">
              <Link to={`/product/${item.product.slug}`} className="w-20 h-24 md:w-24 md:h-28 bg-[#F8F6F3] flex-shrink-0">
                <img src={(item.product.images.find(i=>i.isMain)||item.product.images[0]).url} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${item.product.slug}`} className="font-display uppercase tracking-wide text-[13px] md:text-[15px] truncate">{item.product.name}</Link>
                  <button onClick={()=>removeFromCart(item.product.id)} className="opacity-40 hover:opacity-100 shrink-0"><Trash2 size={14} /></button>
                </div>
                <p className="text-[11px] md:text-[12px] opacity-60 mt-1 line-clamp-1">{item.product.shortDescription}</p>
                <div className="flex items-center justify-between mt-3 md:mt-4">
                  <div className="flex items-center border">
                    <button onClick={()=>updateQuantity(item.product.id, item.quantity-1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-black hover:text-white"><Minus size={11}/></button>
                    <span className="w-8 md:w-10 text-center text-[12px] md:text-[13px]">{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item.product.id, item.quantity+1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-black hover:text-white"><Plus size={11}/></button>
                  </div>
                  <span className="font-semibold text-[13px] md:text-[14px]">{formatPrice(item.product.price*item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0A0A0A] text-white p-6 md:p-8 h-fit lg:sticky lg:top-28 space-y-6">
          <h3 className="font-display text-xl">Order Summary</h3>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between"><span className="opacity-60">Subtotal</span><span>{formatPrice(total)}</span></div>
            <div className="flex justify-between"><span className="opacity-60">Shipping</span><span>{shipping===0?'Free':formatPrice(shipping)}</span></div>
            {shipping>0 && <p className="text-[11px] text-crown-gold uppercase tracking-widest">Add {formatPrice(2500-total)} more for free shipping</p>}
            <div className="flex justify-between font-semibold text-[16px] border-t border-white/10 pt-3"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
          <div className="space-y-3">
            <Link to="/checkout" className="block bg-white text-black text-center py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-crown-gold hover:text-white transition-colors">Proceed to Checkout — COD</Link>
            <a href={whatsappLink(cartWhatsAppMessage(items.map(i=>({name:i.product.name, qty:i.quantity, price:i.product.price})), grandTotal))} target="_blank" rel="noopener noreferrer" className="block border border-white/20 text-center py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[#25D366] hover:border-[#25D366] transition-colors">Order via WhatsApp</a>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-40 text-center">COD Available • Nationwide Delivery • WhatsApp Order</p>
        </div>
      </div>
    </div>
  );
};
