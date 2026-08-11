import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import type { ProductCategory } from '../types';
import { motion } from 'framer-motion';

const categories: { label: string; value: ProductCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Perfume', value: 'perfume' },
  { label: 'Bags', value: 'bags' },
  { label: 'Jewellery', value: 'jewellery' },
];

export const Shop = () => {
  const products = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') list = list.filter(p => p.category === selectedCategory);
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'featured') list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [selectedCategory, sort]);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* Dark hero header */}
      <div className="border-b border-white/5 bg-[#111111]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-3">The Crown Vault</div>
            <h1 className="font-display text-[38px] sm:text-[52px] md:text-[68px] leading-[0.92] text-white">
              Shop All
            </h1>
            <p className="text-[12px] sm:text-[13px] text-white/40 mt-4 max-w-[400px] leading-relaxed">
              Perfumes, ladies bags & jewellery. Signature scent positioning, long-lasting projection, gift box integration.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-8">
            {/* Category chips */}
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                    selectedCategory === cat.value
                      ? 'bg-crown-gold text-[#0A0A0A] font-semibold'
                      : 'border border-white/15 text-white/50 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="ml-auto border border-white/15 bg-transparent text-white/50 px-3 py-2 text-[10px] uppercase tracking-widest outline-none hover:border-white/40 focus:border-crown-gold/50 transition-colors"
            >
              <option value="featured" className="bg-[#111]">Featured</option>
              <option value="newest" className="bg-[#111]">Newest</option>
              <option value="price-low" className="bg-[#111]">Price: Low → High</option>
              <option value="price-high" className="bg-[#111]">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-10 md:py-16">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">{filtered.length} Products</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center border border-white/8 text-white/30 text-[13px] tracking-widest uppercase">
            No products found
          </div>
        ) : (
          <motion.div layout>
            <ProductGrid products={filtered} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
