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
  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.8 }}
      className="group relative flex flex-col"
    >
      {/* Image Container with Hover Quick Add */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F6F3]">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0">
          <img 
            src={mainImage.url} 
            alt={mainImage.alt} 
            className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
            loading="lazy" 
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] tracking-widest uppercase px-3 py-1.5 z-10">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => (inWishlist ? removeFromWishlist(product.id) : addToWishlist(product))}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur rounded-full text-[#1A1A1A] hover:bg-white transition-all shadow-sm"
          title="Add to Wishlist"
        >
          <Heart size={16} fill={inWishlist ? '#1A1A1A' : 'none'} strokeWidth={1} />
        </button>

        {/* Quick Add Slide-up Button */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
          <button 
            onClick={(e) => { e.preventDefault(); addToCart(product); }} 
            className="w-full bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[9px] tracking-[0.3em] uppercase py-4 hover:bg-[#1A1A1A] hover:text-white transition-all duration-500 font-medium"
          >
            Quick Add
          </button>
        </div>
      </div>

      <div className="pt-6 flex flex-col items-center text-center">
        <Link to={`/product/${product.slug}`} className="block hover:opacity-70 transition-opacity duration-500">
          <h3 className="font-display text-[16px] md:text-[18px] tracking-[0.05em] text-[#1A1A1A]">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-[12px] md:text-[13px] text-[#1A1A1A] tracking-[0.15em]">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-[10px] tracking-[0.15em] line-through opacity-30">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
