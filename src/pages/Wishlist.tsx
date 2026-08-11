import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Wishlist = () => {
  const { items } = useWishlist();
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b border-white/8 pb-6">
          <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-2">Saved Items</div>
          <h1 className="font-display text-[36px] sm:text-[48px] leading-none text-white">
            Wishlist <span className="text-white/20 font-sans font-light text-[20px]">({items.length})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 border border-white/8 flex flex-col items-center">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center mb-5">
              <Heart size={22} strokeWidth={1} className="text-white/20" />
            </div>
            <p className="font-display text-[22px] text-white/50">Your wishlist is empty</p>
            <p className="text-[12px] text-white/25 mt-2">Save your favorite ROOH fragrances & pieces</p>
            <Link
              to="/shop"
              className="mt-7 inline-flex bg-crown-gold text-[#0A0A0A] px-8 py-3.5 text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
            >
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-10 md:gap-6 md:gap-y-14">
            {items.map(({ product }, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
