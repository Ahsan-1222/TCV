import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, title }: { products: Product[]; title?: string }) => {
  return (
    <div className="w-full">
      {title && (
        <div className="flex flex-col items-center justify-center mb-8 md:mb-14 text-center">
          {/* Gold divider */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-10 bg-crown-gold/40" />
            <span className="text-[9px] tracking-[0.38em] uppercase text-crown-gold">Curated Collection</span>
            <div className="h-[1px] w-10 bg-crown-gold/40" />
          </div>
          <h2 className="font-display text-[26px] sm:text-[32px] md:text-[42px] leading-none text-white tracking-wide">
            {title}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-10 md:gap-x-6 md:gap-y-14">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};
