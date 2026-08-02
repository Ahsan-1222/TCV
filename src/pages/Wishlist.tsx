import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { Link } from 'react-router-dom';

export const Wishlist = () => {
  const { items } = useWishlist();
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      <h1 className="font-display text-[36px] leading-none">Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 border border-dashed mt-8">
          <p className="font-display text-xl">Your wishlist is empty</p>
          <p className="text-[13px] opacity-60 mt-2">Save your favorite ROOH fragrances</p>
          <Link to="/shop" className="mt-6 inline-flex bg-black text-white px-8 py-3 text-[11px] tracking-widest uppercase">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-neutral-100 border border-neutral-100 mt-8">
          {items.map(({ product }, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
};
