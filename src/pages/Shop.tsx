import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import type { ProductCategory } from '../types';
import { SlidersHorizontal, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';

export const Shop = () => {
  const products = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [selectedCategory, sort, priceRange]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display text-[36px] leading-none">Shop All</h1>
          <p className="text-[13px] opacity-60 mt-3 max-w-[480px]">Perfumes primary focus, with ladies bags and jewellery. Signature scent positioning, long-lasting projection, gift box integration.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border bg-white p-1 overflow-x-auto">
            {(['all', 'perfume', 'bags', 'jewellery'] as const).map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 md:px-4 py-2 text-[10px] md:text-[11px] tracking-widest uppercase transition-colors whitespace-nowrap ${selectedCategory === cat ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}>{cat}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="border bg-white px-3 md:px-4 py-2.5 text-[10px] md:text-[11px] uppercase tracking-widest">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block space-y-8 sticky top-28 h-fit">
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2"><SlidersHorizontal size={14} /> Filters</h4>
            <div className="space-y-6">
              <div>
                <div className="text-[12px] font-medium mb-3">Price Range</div>
                <div className="space-y-3">
                  <input type="range" min={0} max={10000} step={100} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} className="w-full accent-black" />
                  <div className="flex justify-between text-[11px] opacity-60"><span>Rs. {priceRange[0]}</span><span>Rs. {priceRange[1]}</span></div>
                </div>
              </div>
              <div>
                <div className="text-[12px] font-medium mb-3">Attributes</div>
                <div className="space-y-2 text-[12px] opacity-70">
                  <label className="flex items-center gap-2"><input type="checkbox" /> Best Seller</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> New Arrival</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Gift Box</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> COD Available</label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6 text-[11px] uppercase tracking-widest opacity-60">
            <span>{filtered.length} Products</span>
            <div className="flex items-center gap-2"><Grid size={16} /><List size={16} className="opacity-30" /></div>
          </div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center border border-dashed">No products found</div>
          ) : (
            <motion.div layout><ProductGrid products={filtered} /></motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
