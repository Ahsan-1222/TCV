import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(product.id);
  const mainImage = product.images.find(i => i.isMain) || product.images[0];
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05, duration: 0.7 }}
      className="group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#161616] rounded-sm flex items-center justify-center">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0">
          <img
            src={mainImage.url}
            alt={mainImage.alt}
            className="w-full h-full object-cover object-center max-w-full transition-transform duration-[2s] ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-700" />
        </Link>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-crown-gold text-[#0A0A0A] text-[9px] tracking-widest uppercase px-2 py-1 z-10 font-semibold">
            -{discount}%
          </div>
        )}

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
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="w-full bg-crown-gold text-[#0A0A0A] text-[9px] sm:text-[10px] tracking-[0.25em] uppercase py-3 sm:py-3.5 font-semibold hover:bg-crown-gold-dark transition-colors duration-300"
          >
            Quick Add
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
