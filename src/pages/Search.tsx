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
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">
      <h1 className="font-display text-[32px]">Search</h1>
      <div className="mt-6 max-w-xl flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search perfumes, bags, jewellery..." className="flex-1 border bg-white px-5 py-3 text-sm outline-none focus:border-black" />
        <span className="border bg-black text-white px-6 py-3 text-[11px] tracking-widest uppercase">{filtered.length} results</span>
      </div>

      <div className="mt-10">
        {query ? filtered.length ? <ProductGrid products={filtered} title={`Results for "${query}"`} /> : <div className="py-16 text-center border border-dashed">No products found for "{query}"</div> : <div className="py-16 text-center opacity-60 text-sm">Type to search our luxury collections</div>}
      </div>
    </div>
  );
};
