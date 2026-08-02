import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cartWhatsAppMessage, whatsappLink } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppFloat = () => {
  const [open, setOpen] = useState(false);
  const { items, total } = useCart();

  const cartMsg = items.length ? cartWhatsAppMessage(items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })), total) : "Assalam-o-Alaikum! I have a question about THE CROWN VAULT products. COD available?";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-neutral-100 w-[320px] overflow-hidden">
              <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">👑</div>
                  <div>
                    <div className="text-[13px] font-medium">THE CROWN VAULT</div>
                    <div className="text-[11px] opacity-80">Typically replies instantly</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1"><X size={16} /></button>
              </div>
              <div className="p-4 bg-[#E5DDD5] space-y-3 text-[12px]">
                <div className="bg-white p-3 rounded-[8px] rounded-tl-none shadow-sm max-w-[85%]">Hello! 👋 Looking for ROOH fragrances or bags? We have COD & nationwide delivery.</div>
                {items.length > 0 && <div className="bg-[#DCF8C6] p-3 rounded-[8px] rounded-tr-none shadow-sm ml-auto max-w-[85%]">You have {items.length} items in cart — ready to order via WhatsApp?</div>}
              </div>
              <div className="p-3 bg-white border-t flex gap-2">
                <a href={whatsappLink(cartMsg)} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white text-[12px] tracking-wide py-2.5 text-center uppercase font-medium hover:bg-[#128C7E] transition-colors">Open WhatsApp</a>
                <button onClick={() => setOpen(false)} className="px-4 py-2.5 border text-[11px] uppercase tracking-wide">Close</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)} className="w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] flex items-center justify-center hover:bg-[#128C7E] transition-colors">
          {open ? <X size={22} /> : <MessageCircle size={24} fill="white" />}
        </motion.button>
      </div>

      {/* Inline WhatsApp CTA on product pages handled separately */}
    </>
  );
};
