import { useSearchParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';

export const SearchPage = () => {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const products = useProducts();

  const filtered = useMemo(() => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower) || p.tags.some(t => t.toLowerCase().includes(lower)));
  }, [query]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
        <h1 className="font-display text-[32px] sm:text-[40px] uppercase text-white">Search</h1>
        <div className="mt-6 max-w-xl flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search perfumes, bags, watches..."
            className="flex-1 bg-[#111111] border border-white/15 px-5 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-crown-gold/60 transition-colors"
          />
          <span className="bg-crown-gold text-[#0A0A0A] px-6 py-3 text-[11px] tracking-widest uppercase font-semibold flex items-center shrink-0">
            {filtered.length} results
          </span>
        </div>

        <div className="mt-10">
          {query ? (
            filtered.length ? (
              <ProductGrid products={filtered} title={`Results for "${query}"`} />
            ) : (
              <div className="py-16 text-center border border-dashed border-white/10 text-white/40 text-sm">
                No products found matching "{query}"
              </div>
            )
          ) : (
            <div className="py-16 text-center text-white/40 text-sm tracking-wide">
              Type to search our luxury collections
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
