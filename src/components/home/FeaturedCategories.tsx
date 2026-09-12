import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useCategoryBanners } from '../../hooks/useCategoryBanners';
import { ScrollReveal } from '../ui/ScrollReveal';
import { ScrollParallax } from '../ui/ScrollParallax';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format';

export const FeaturedCategories = () => {
  const cats = useCategoryBanners();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  /* Guard against a shrinking list */
  const safeActive = Math.min(active, Math.max(cats.length - 1, 0));
  const current = cats[safeActive];

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-20 md:py-28">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-14">

        {/* ── Header ─────────────────────────────────────────────── */}
        <ScrollReveal direction="up" distance={25} duration={0.8}>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold flex items-center gap-3">
                <span className="h-px w-6 bg-crown-gold/60 inline-block" />
                Categories
              </div>
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-normal leading-[1] tracking-[-0.02em] text-white">
                Shop by category
              </h2>
            </div>
            <Link
              to="/shop"
              className="group hidden items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-crown-gold sm:flex"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* ── DESKTOP: hover-index + preview ─────────────────────── */}
        <div className="hidden gap-12 lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Index list */}
          <ScrollReveal direction="up" distance={30} duration={0.85} className="flex flex-col">
            <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {cats.map((c, i) => {
                const isActive = safeActive === i;
                return (
                  <Link
                    key={c.slug}
                    to={`/categories/${c.slug}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center justify-between gap-8 py-8 transition-colors duration-300"
                  >
                    <div className="flex items-baseline gap-6">
                      <span
                        className={`w-8 text-[11px] tabular-nums tracking-[0.24em] transition-colors duration-500 ${
                          isActive ? 'text-crown-gold' : 'text-white/25'
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <h3
                        className={`font-display text-[clamp(2rem,4vw,3.4rem)] font-normal leading-none tracking-[-0.02em] transition-colors duration-500 ${
                          isActive ? 'text-crown-gold' : 'text-white'
                        }`}
                      >
                        {c.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                        {c.count} {c.unit}
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 transition-all duration-500 ${
                          isActive
                            ? 'translate-x-0.5 -translate-y-0.5 text-crown-gold'
                            : 'text-white/30'
                        }`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Supporting line below */}
            {current && (
              <motion.p
                key={current.slug}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="mt-8 max-w-[440px] text-[13px] font-light leading-[2] text-white/45"
              >
                {current.desc}
              </motion.p>
            )}
          </ScrollReveal>

          {/* Preview image */}
          <ScrollReveal direction="up" distance={30} duration={0.9} delay={0.12} className="relative">
            <ScrollParallax speed={0.06} offset={16} className="h-[560px] xl:h-[640px] rounded-sm border border-white/10 shadow-2xl bg-[#111]">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.slug}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    className="absolute inset-0"
                  >
                    <img
                      src={current.image}
                      alt={current.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scrims */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 border border-crown-gold/20" />

              {/* Overlay label */}
              {current && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-8 z-10">
                  <div>
                    <div
                      className="text-[10px] font-semibold uppercase tracking-[0.42em]"
                      style={{ color: current.accent }}
                    >
                      {current.label}
                    </div>
                    <div className="mt-2 font-display text-[26px] leading-none text-white">
                      {current.title}
                    </div>
                  </div>
                  <span className="border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] tabular-nums tracking-[0.24em] text-white/70 backdrop-blur-md">
                    {String(safeActive + 1).padStart(2, '0')} / {String(cats.length).padStart(2, '0')}
                  </span>
                </div>
              )}
            </ScrollParallax>
          </ScrollReveal>
        </div>

        {/* ── MOBILE / TABLET: stacked cards ─────────────────────── */}
        <ScrollReveal direction="up" distance={25} duration={0.7} stagger={0.08} className="space-y-4 lg:hidden">
          {cats.map((c, i) => (
            <div key={c.slug} className="block">
              <Link
                to={`/categories/${c.slug}`}
                className="group block overflow-hidden border border-white/10 bg-[#0E0E0E] transition-colors duration-500 hover:border-crown-gold/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div
                      className="text-[9px] font-semibold uppercase tracking-[0.4em]"
                      style={{ color: c.accent }}
                    >
                      {c.label}
                    </div>
                    <h3 className="mt-1.5 font-display text-[26px] leading-none text-white">
                      {c.title}
                    </h3>
                  </div>

                  <span className="absolute right-4 top-4 border border-white/20 bg-black/50 px-2.5 py-1 text-[9px] tabular-nums tracking-[0.24em] text-white/70 backdrop-blur-md">
                    0{i + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    {c.count} {c.unit}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/40 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-crown-gold" />
                </div>
              </Link>
            </div>
          ))}

          <div className="pt-3 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-crown-gold"
            >
              View all collections
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};