import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const cats = [
  {
    title: 'Perfume',
    label: 'Signature Fragrances',
    desc: 'Long-lasting Extrait • Gift Box Ready',
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (2).jpeg')}`,
    slug: 'perfume',
    count: '05',
    unit: 'Scents',
    accent: '#C9A86A',
  },
  {
    title: 'Bags',
    label: 'Ladies Collection',
    desc: 'Office Totes • Evening Clutches',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format',
    slug: 'bags',
    count: '12',
    unit: 'Designs',
    accent: '#1A1A1A',
  },
  {
    title: 'Jewellery',
    label: 'Fine Pieces',
    desc: 'Polished Gold • Diamond Dust',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=900&auto=format',
    slug: 'jewellery',
    count: '08',
    unit: 'Pieces',
    accent: '#C9A86A',
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="bg-[#0A0A0A] py-14 sm:py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-8 md:mb-14"
        >
          <div>
            <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold/70 mb-2">Curated Departments</div>
            <h2 className="font-display text-[28px] sm:text-[36px] md:text-[52px] leading-none text-white">
              Shop By Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-crown-gold transition-colors group"
          >
            <span>View All</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="md:hidden space-y-3">
          {cats.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link
                to={`/categories/${c.slug}`}
                className="group relative flex items-center overflow-hidden rounded-sm"
                style={{ background: '#161616' }}
              >
                {/* Image thumbnail */}
                <div className="relative w-[38%] aspect-square flex-shrink-0 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-active:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Text content */}
                <div className="flex-1 px-4 py-4">
                  <div className="text-[8px] tracking-[0.35em] uppercase mb-1" style={{ color: c.accent }}>
                    {c.label}
                  </div>
                  <h3 className="font-display text-[22px] leading-none text-white mb-2">{c.title}</h3>
                  <p className="text-[9px] tracking-[0.15em] uppercase text-white/35 leading-[1.7]">{c.desc}</p>
                  <div className="flex items-end gap-1 mt-3">
                    <span className="font-display text-[28px] leading-none text-white/15">{c.count}</span>
                    <span className="text-[8px] tracking-[0.25em] uppercase text-white/30 mb-1">{c.unit}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="pr-4">
                  <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center group-active:bg-crown-gold group-active:border-crown-gold transition-all">
                    <ArrowRight size={12} className="text-white/40 group-active:text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Mobile: View all */}
          <div className="pt-2 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-crown-gold transition-colors"
            >
              View All Collections <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-px bg-white/5">
          {cats.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15 }}
            >
              <Link
                to={`/categories/${c.slug}`}
                className="group relative block overflow-hidden bg-[#0E0E0E] hover:bg-[#141414] transition-colors duration-500"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-108"
                    style={{ transform: 'scale(1.01)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.01)')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />

                  {/* Count watermark */}
                  <div className="absolute top-6 right-6 font-display text-[72px] leading-none text-white/5 select-none pointer-events-none">
                    {c.count}
                  </div>
                </div>

                {/* Text */}
                <div className="p-6 lg:p-8 border-t border-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: c.accent }}>
                        {c.count} {c.unit}
                      </div>
                      <h3 className="font-display text-[32px] lg:text-[40px] leading-none text-white group-hover:text-crown-gold transition-colors duration-500">
                        {c.title}
                      </h3>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mt-3 leading-[1.8]">
                        {c.desc}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center mt-1 group-hover:border-crown-gold group-hover:bg-crown-gold transition-all duration-500">
                      <ArrowRight size={14} className="text-white/40 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
