import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { formatPrice, whatsappLink, productWhatsAppMessage } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Minus, Plus, Star, Truck, Shield, MessageCircle, ChevronRight } from 'lucide-react';
import { ProductGrid } from '../components/product/ProductGrid';
import { motion } from 'framer-motion';

export const ProductDetail = () => {
  const { slug } = useParams();
  const products = useProducts();
  const product = products.find(p => p.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!product) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white/40 text-[13px] tracking-widest uppercase">
      Product not found
    </div>
  );

  const mainImg = product.images[activeImage] || product.images[0];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWishlist = isInWishlist(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-5 pb-0">
        <div className="flex items-center gap-1.5 text-[9px] tracking-widest uppercase text-white/25">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-white/50">{product.name}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14">

          {/* Gallery */}
          <div className="space-y-3">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-[4/5] sm:aspect-[4/5] max-h-[580px] sm:max-h-none bg-[#111111] overflow-hidden relative rounded-sm flex items-center justify-center"
            >
              <img src={mainImg.url} alt={mainImg.alt} className="w-full h-full object-cover object-center max-w-full" />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-crown-gold text-[#0A0A0A] text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
                  -{discount}%
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square bg-[#111111] overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i ? 'border-crown-gold' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-crown-gold/30 px-3 py-1.5 text-[9px] tracking-[0.25em] uppercase text-crown-gold mb-4 w-fit">
              <span className="w-1 h-1 bg-crown-gold rounded-full" />
              {product.category} · {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            <h1 className="font-display text-[30px] sm:text-[38px] md:text-[46px] leading-[0.92] tracking-tight uppercase text-white">
              {product.name}
            </h1>
            <p className="text-[13px] text-white/45 mt-3 leading-relaxed">{product.shortDescription}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < Math.floor(product.rating) ? '#C9A86A' : 'none'}
                    color={i < Math.floor(product.rating) ? '#C9A86A' : '#333'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-white/40">{product.rating} ({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display text-[30px] font-medium text-crown-gold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="line-through text-white/25 text-[14px]">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-white/8 pt-5 space-y-3 text-[13px] leading-[1.85] text-white/50">
              <p>{product.description}</p>
              {product.scentNotes && (
                <div className="grid grid-cols-3 gap-3 mt-5 text-[11px]">
                  {[['Top Notes', product.scentNotes.top], ['Heart', product.scentNotes.heart], ['Base', product.scentNotes.base]].map(([label, notes]) => (
                    <div key={label as string}>
                      <div className="text-[8px] tracking-[0.3em] uppercase text-crown-gold/70 mb-1.5">{label}</div>
                      <div className="text-white/60 leading-[1.6]">{(notes as string[]).join(', ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Online discount banner */}
            <div className="mt-5 bg-crown-gold/10 border border-crown-gold/25 p-4 flex items-start gap-3">
              <span className="text-crown-gold text-[16px] mt-0.5">✦</span>
              <div className="text-[12px] leading-relaxed text-white/60">
                <strong className="text-white block mb-0.5 text-[13px]">Save Rs. 100!</strong>
                Pay online (Easypaisa) to get an instant Rs. 100 discount. COD available at original price.
              </div>
            </div>

            {/* Qty + Add to Cart */}
            <div className="mt-6 flex flex-wrap sm:flex-nowrap gap-2">
              <div className="flex items-center border border-white/15 shrink-0">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center text-[13px] text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-12 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
                  <Plus size={13} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex-1 min-w-[160px] h-12 bg-crown-gold text-[#0A0A0A] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors flex justify-center items-center"
              >
                Add to Cart — {formatPrice(product.price * qty)}
              </button>
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`w-12 h-12 shrink-0 border flex items-center justify-center transition-all ${
                  inWishlist
                    ? 'bg-crown-gold border-crown-gold text-[#0A0A0A]'
                    : 'border-white/15 text-white/50 hover:border-crown-gold hover:text-crown-gold'
                }`}
              >
                <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
              </button>
            </div>

            {/* WhatsApp + COD */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={whatsappLink(productWhatsAppMessage(product.name, product.price, window.location.href))}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#25D366] text-[#25D366] h-12 text-[10px] tracking-[0.2em] uppercase text-center flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <MessageCircle size={13} /> Order on WhatsApp
              </a>
              <div className="border border-white/10 h-12 text-[10px] tracking-[0.2em] uppercase text-center text-white/40 flex items-center justify-center gap-2">
                <Truck size={13} /> COD Available
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/8 pt-5 text-[10px]">
              {[
                [Shield, 'Authentic', '100% Original'],
                [Truck, 'Nationwide', 'Free over 2500'],
                [MessageCircle, 'WhatsApp', 'Instant reply'],
              ].map(([Icon, title, sub]) => (
                <div key={title as string} className="flex gap-2">
                  {/* @ts-ignore */}
                  <Icon size={15} className="text-crown-gold/60 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/50 font-medium">{title as string}</div>
                    <div className="text-white/25 text-[9px] mt-0.5">{sub as string}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews */}
            {product.reviews.length > 0 && (
              <div className="mt-8 border-t border-white/8 pt-6">
                <h3 className="font-display text-[20px] text-white mb-4">Reviews ({product.reviewCount})</h3>
                <div className="space-y-3">
                  {product.reviews.map(r => (
                    <div key={r.id} className="border border-white/8 p-4 bg-[#111111]">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-white">{r.userName}</span>
                        <span className="text-[10px] text-white/30">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 text-crown-gold text-[12px] mt-1.5">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                      <p className="text-[12px] mt-2 text-white/45 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-20 border-t border-white/5">
          <ProductGrid products={related} title="You May Also Like" />
        </div>
      )}
    </div>
  );
};
