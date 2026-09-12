import { useState, useMemo, useRef, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductGrid } from '../components/product/ProductGrid';
import type { ProductCategory } from '../types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ─────────────────────────────  DATA  ───────────────────────────── */

type SortKey = 'featured' | 'newest' | 'price-low' | 'price-high';

const categories: { label: string; value: ProductCategory | 'all'; count?: number }[] = [
  { label: 'All', value: 'all' },
  { label: 'Perfume', value: 'perfume' },
  { label: 'Bags', value: 'bags' },
  { label: 'Watches', value: 'watches' },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price · Low to High', value: 'price-low' },
  { label: 'Price · High to Low', value: 'price-high' },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────  ICONS  ──────────────────────────── */

const Chevron = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Check = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const Close = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const Sliders = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);

/* ────────────────────────────  COMPONENT  ──────────────────────────── */

export const Shop = () => {
  const products = useProducts();
  const reduce = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== 'all') list = list.filter((p) => p.category === selectedCategory);
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'newest')
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else {
      list.sort((a, b) => {
        const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 9999;
        const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 9999;
        return orderA - orderB;
      });
    }
    return list;
  }, [products, selectedCategory, sort]);

  /* Category counts */
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const p of products) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [products]);

  /* Close the sort dropdown on outside click / Escape */
  useEffect(() => {
    if (!sortOpen) return;
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSortOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);

  const activeSort = sortOptions.find((o) => o.value === sort)!;

  return (
    <div className="relative min-h-screen bg-[#080808] text-white antialiased">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1560px] px-5 pt-16 sm:px-8 md:pt-24 lg:px-14">
          {/* Meta row */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-between gap-6 border-b border-white/10 pb-6"
          >
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-crown-gold" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/55">
                The Crown Vault · Shop
              </span>
            </div>
            <span className="hidden text-[9px] uppercase tracking-[0.42em] text-white/30 sm:block">
              {products.length.toString().padStart(2, '0')} Pieces
            </span>
          </motion.div>

          {/* Title block */}
          <div className="grid gap-8 pt-10 md:grid-cols-12 md:gap-12 md:pt-14">
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="md:col-span-8"
            >
              <h1 className="font-display text-[clamp(2.75rem,10vw,7rem)] font-normal leading-[0.88] tracking-[-0.035em] text-white">
                The
                <span className="ml-[0.15em] italic font-light text-crown-gold">Collection</span>
              </h1>
            </motion.div>

            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
              className="self-end md:col-span-4"
            >
              <p className="max-w-[380px] text-[13.5px] font-light leading-[2] text-white/45">
                Perfumes, handbags & timepieces — every piece chosen for the detail you feel up close. Nationwide
                delivery, cash on delivery available.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STICKY TOOLBAR ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-14">
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Category chips */}
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => {
                const active = selectedCategory === cat.value;
                const count = counts[cat.value] ?? 0;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    aria-pressed={active}
                    className={`group relative shrink-0 rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/60 ${
                      active
                        ? 'border-crown-gold bg-crown-gold text-black'
                        : 'border-white/12 text-white/55 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {cat.label}
                    <span className={`ml-2 tabular-nums ${active ? 'text-black/60' : 'text-white/30'}`}>
                      {String(count).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className="group flex items-center gap-3 rounded-full border border-white/12 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 transition-colors duration-300 hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/60"
              >
                <Sliders className="h-3.5 w-3.5 text-crown-gold" />
                <span className="hidden sm:inline">Sort</span>
                <span className="text-white">{activeSort.label}</span>
                <Chevron
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.ul
                    role="listbox"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] origin-top-right overflow-hidden rounded-lg border border-white/12 bg-[#0E0E0E]/95 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-xl"
                  >
                    {sortOptions.map((opt) => {
                      const active = opt.value === sort;
                      return (
                        <li key={opt.value}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setSort(opt.value);
                              setSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                              active
                                ? 'bg-crown-gold/10 text-crown-gold'
                                : 'text-white/55 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {opt.label}
                            {active && <Check className="h-3.5 w-3.5" />}
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1560px] px-5 py-10 sm:px-8 md:py-14 lg:px-14">
        {/* Result meta */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 md:mb-10">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-[22px] tabular-nums text-white md:text-[26px]">
              {String(filtered.length).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              {filtered.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          {/* Active filter pill */}
          <AnimatePresence mode="wait">
            {selectedCategory !== 'all' && (
              <motion.button
                key={selectedCategory}
                type="button"
                onClick={() => setSelectedCategory('all')}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="group flex items-center gap-2 rounded-full border border-crown-gold/40 bg-crown-gold/[0.06] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-crown-gold transition-colors duration-300 hover:border-crown-gold hover:bg-crown-gold/15"
              >
                {categories.find((c) => c.value === selectedCategory)?.label}
                <Close className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Products / empty state */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="flex flex-col items-center justify-center gap-4 border border-white/10 bg-[#0A0A0A] px-6 py-24 text-center md:py-32"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full border border-crown-gold/40">
              <span className="font-display text-[20px] text-crown-gold">∅</span>
            </div>
            <h3 className="font-display text-[22px] text-white md:text-[26px]">
              Nothing here yet
            </h3>
            <p className="max-w-[340px] text-[12.5px] leading-relaxed text-white/40">
              No pieces match this filter. Try another category or view the full collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSort('featured');
              }}
              className="mt-2 rounded-full border border-crown-gold/60 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-crown-gold transition-colors duration-300 hover:bg-crown-gold hover:text-black"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout transition={{ duration: 0.4, ease: EASE_OUT }}>
            <ProductGrid products={filtered} />
          </motion.div>
        )}
      </section>

      {/* ── FOOT NOTE ────────────────────────────────────────────────── */}
      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8 lg:px-14">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/35">
            <span className="h-px w-8 bg-crown-gold/60" />
            Cash on Delivery · WhatsApp Orders · Pakistan
          </div>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-medium uppercase tracking-[0.32em] text-crown-gold underline-offset-8 transition hover:underline"
          >
            Order on WhatsApp →
          </a>
        </div>
      </section>
    </div>
  );
};