import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, title }: { products: Product[]; title?: string }) => {
  return (
    <div className="w-full">
      {title && (
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-crown-gold/50"></span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-crown-gold">Curated Collection</span>
            <span className="w-8 h-[1px] bg-crown-gold/50"></span>
          </div>
          <h2 className="font-display text-[32px] md:text-[40px] tracking-wide text-[#1A1A1A]">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};
