import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import gsap from 'gsap';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images?.find(i => i.isMain) || product.images?.[0];
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(cardRef.current, {
      rotateY: x * 0.04,
      rotateX: -y * 0.04,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'power2.out',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#161616] rounded-sm flex items-center justify-center">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0">
          {mainImage?.url ? (
            <img
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              className={`w-full h-full object-cover max-w-full transition-transform duration-[2s] ease-out group-hover:scale-105 ${
                mainImage.position === 'left' ? 'object-left' : mainImage.position === 'right' ? 'object-right' : 'object-center'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs tracking-widest uppercase">
              No Image
            </div>
          )}
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
        </Link>

        {/* Stock / Discount badge */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-black/80 text-white/70 border border-white/20 text-[9px] tracking-widest uppercase px-2 py-1 z-10 font-medium">
            Sold Out
          </div>
        ) : discount > 0 ? (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-crown-gold text-[#0A0A0A] text-[9px] tracking-widest uppercase px-2 py-1 z-10 font-semibold">
            -{discount}%
          </div>
        ) : null}

        {/* Wishlist */}
        <button
          onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
            inWishlist
              ? 'bg-crown-gold text-[#0A0A0A]'
              : 'bg-black/40 backdrop-blur text-white/60 hover:bg-black/70 hover:text-white'
          }`}
          title="Add to Wishlist"
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.preventDefault();
              if (!isOutOfStock) addToCart(product);
            }}
            className={`w-full text-[9px] sm:text-[10px] tracking-[0.25em] uppercase py-3 sm:py-3.5 font-semibold transition-colors duration-300 ${
              isOutOfStock
                ? 'bg-neutral-800 text-white/40 cursor-not-allowed'
                : 'bg-crown-gold text-[#0A0A0A] hover:bg-crown-gold-dark cursor-pointer'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3.5 sm:pt-4 flex flex-col items-center text-center">
        <Link
          to={`/product/${product.slug}`}
          className="block hover:text-crown-gold transition-colors duration-300"
        >
          <h3 className="font-display text-[13px] sm:text-[15px] md:text-[17px] tracking-[0.04em] text-white line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3">
          <span className="text-[11px] sm:text-[12px] text-crown-gold tracking-[0.12em] font-medium">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-[9px] sm:text-[10px] tracking-[0.1em] line-through text-white/25">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
