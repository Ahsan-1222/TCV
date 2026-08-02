import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { formatPrice, whatsappLink, productWhatsAppMessage } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Minus, Plus, Star, Truck, Shield, MessageCircle } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';

export const ProductDetail = () => {
  const { slug } = useParams();
  const products = useProducts();
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const mainImg = product.images[activeImage] || product.images[0];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8">
      <div className="text-[11px] tracking-widest uppercase opacity-50 mb-6">
        <Link to="/" className="hover:underline">Home</Link> / <Link to="/shop" className="hover:underline">Shop</Link> / <span className="text-black">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-[#F8F6F3] overflow-hidden relative">
            <img src={mainImg.url} alt={mainImg.alt} className="w-full h-full object-cover" />
            {product.comparePrice && <div className="absolute top-4 left-4 bg-black text-white text-[11px] px-3 py-1">-{Math.round(((product.comparePrice - product.price)/product.comparePrice)*100)}%</div>}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square bg-[#F8F6F3] overflow-hidden border-2 ${activeImage===i?'border-black':'border-transparent'}`}>
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="inline-flex items-center gap-2 border border-crown-gold/30 px-3 py-1 text-[10px] tracking-widest uppercase mb-4">
            <span className="w-1 h-1 bg-crown-gold rounded-full"></span>
            {product.category} • {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>
          <h1 className="font-display text-[36px] md:text-[44px] leading-[0.9] tracking-tight uppercase">{product.name}</h1>
          <p className="text-[13px] opacity-60 mt-3">{product.shortDescription}</p>

          <div className="flex items-center gap-3 mt-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'} color={i < Math.floor(product.rating) ? '#C9A86A' : '#e5e5e5'} />)}
            </div>
            <span className="text-[12px]">{product.rating} ({product.reviewCount} reviews)</span>
            <span className="text-[11px] uppercase tracking-widest opacity-50">SKU: {product.sku}</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-[28px] font-display font-medium">{formatPrice(product.price)}</span>
            {product.comparePrice && <span className="line-through opacity-40 text-[14px]">{formatPrice(product.comparePrice)}</span>}
          </div>

          <div className="mt-8 space-y-4 text-[13px] leading-7 opacity-80 border-t border-neutral-100 pt-6">
            <p>{product.description}</p>
            {product.scentNotes && (
              <div className="grid grid-cols-3 gap-4 mt-6 text-[11px] leading-5">
                <div><div className="uppercase tracking-widest opacity-50 mb-1">Top Notes</div><div className="font-medium">{product.scentNotes.top.join(', ')}</div></div>
                <div><div className="uppercase tracking-widest opacity-50 mb-1">Heart</div><div className="font-medium">{product.scentNotes.heart.join(', ')}</div></div>
                <div><div className="uppercase tracking-widest opacity-50 mb-1">Base</div><div className="font-medium">{product.scentNotes.base.join(', ')}</div></div>
              </div>
            )}
          </div>

          {/* Payment Method Discount Banner */}
          <div className="mt-6 bg-[#FAF9F6] border border-crown-gold/30 p-4 flex items-start gap-3">
            <div className="text-crown-gold mt-0.5">✨</div>
            <div className="text-[12px] leading-relaxed">
              <strong className="block text-black mb-1 text-[13px]">Save Rs. 100 on this product!</strong>
              Pay via any <strong className="text-black">Online Payment Method</strong> to get an instant Rs. 100 discount. (Cash on Delivery is available at the original price).
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-8 flex gap-2 md:gap-3">
            <div className="flex items-center border shrink-0">
              <button onClick={() => setQty(Math.max(1, qty-1))} className="w-10 md:w-12 h-[48px] flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Minus size={14} /></button>
              <span className="w-10 md:w-12 text-center text-[14px]">{qty}</span>
              <button onClick={() => setQty(qty+1)} className="w-10 md:w-12 h-[48px] flex items-center justify-center hover:bg-black hover:text-white transition-colors"><Plus size={14} /></button>
            </div>
            <button onClick={() => addToCart(product, qty)} className="flex-1 h-[48px] bg-black text-white text-[10px] md:text-[11px] tracking-[0.05em] md:tracking-[0.2em] uppercase hover:bg-crown-gold transition-colors flex flex-col justify-center items-center px-1">
              <span>Add to Cart — {formatPrice(product.price * qty)}</span>
            </button>
            <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)} className={`w-[48px] h-[48px] shrink-0 border flex items-center justify-center transition-colors ${inWishlist?'bg-crown-gold text-white border-crown-gold':'hover:bg-black hover:text-white'}`}>
              <Heart size={18} fill={inWishlist?'white':'none'} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={whatsappLink(productWhatsAppMessage(product.name, product.price, window.location.href))} target="_blank" rel="noopener noreferrer" className="border border-[#25D366] text-[#25D366] h-[48px] text-[11px] tracking-[0.15em] uppercase text-center flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors">
              <MessageCircle size={14} /> Order on WhatsApp
            </a>
            <div className="border h-[48px] text-[11px] tracking-[0.15em] uppercase text-center opacity-80 flex items-center justify-center gap-2"><Truck size={14} /> COD Available</div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6 text-[11px] leading-5">
            <div className="flex gap-2"><Shield size={16} className="opacity-50" /><div><div className="uppercase tracking-widest font-medium">Authentic</div><div className="opacity-60">100% Original</div></div></div>
            <div className="flex gap-2"><Truck size={16} className="opacity-50" /><div><div className="uppercase tracking-widest font-medium">Nationwide</div><div className="opacity-60">Free over 2500</div></div></div>
            <div className="flex gap-2"><MessageCircle size={16} className="opacity-50" /><div><div className="uppercase tracking-widest font-medium">WhatsApp</div><div className="opacity-60">Instant reply</div></div></div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h3 className="font-display text-xl mb-4">Reviews ({product.reviewCount})</h3>
            <div className="space-y-4">
              {product.reviews.length ? product.reviews.map(r => (
                <div key={r.id} className="border p-4 bg-[#FCFBF9]">
                  <div className="flex items-center justify-between"><span className="font-medium text-[13px]">{r.userName}</span><span className="text-[11px] opacity-50">{r.date}</span></div>
                  <div className="flex gap-1 text-crown-gold text-[12px] mt-1">{'★★★★★'.slice(0, r.rating)}</div>
                  <p className="text-[13px] mt-2 opacity-70">{r.comment}</p>
                </div>
              )) : <p className="text-[13px] opacity-60">No reviews yet. Be the first to review.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <ProductGrid products={related} title="You May Also Like" />
      </div>
    </div>
  );
};
