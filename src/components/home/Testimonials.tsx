import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'M Usman',
    city: 'Rawalpindi',
    text: 'ROOH AVANT is my signature now. Luxury packaging and WhatsApp order made it so easy. COD delivered in 2 days.',
    rating: 5,
  },
  {
    name: 'Ahsan M.',
    city: 'Karachi',
    text: 'The Crown Vault team curated perfectly. GOLD extrait lasts entire wedding. Highly polished gold bottle looks premium.',
    rating: 5,
  },
  {
    name: 'Faisal R.',
    city: 'Islamabad',
    text: 'Bought bags and perfume combo. Matte black tote stitch quality is exceptional. Will reorder.',
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="bg-[#111111] py-16 sm:py-24 md:py-32 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-3">Verified Reviews</div>
          <h2 className="font-display text-[30px] sm:text-[38px] md:text-[48px] leading-none text-white">
            Client Chronicles.
          </h2>
        </motion.div>

        {/* Mobile: cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="bg-[#161616] border border-white/6 p-6 rounded-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(r.rating).fill(0).map((_, si) => (
                  <span key={si} className="text-crown-gold text-[14px]">★</span>
                ))}
              </div>
              <p className="font-display text-[17px] sm:text-[19px] leading-[1.55] italic text-white/80">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/6">
                <div className="w-7 h-7 rounded-full bg-crown-gold/20 flex items-center justify-center text-crown-gold text-[11px] font-semibold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-[11px] tracking-[0.12em] uppercase text-white">{r.name}</div>
                  <div className="text-[9px] tracking-widest uppercase text-white/30">{r.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: 3-col */}
        <div className="hidden md:grid md:grid-cols-3 divide-x divide-white/6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 1 }}
              className="flex flex-col items-center text-center px-8 lg:px-12 py-6"
            >
              <div className="flex gap-1 mb-6">
                {Array(r.rating).fill(0).map((_, si) => (
                  <span key={si} className="text-crown-gold text-[18px]">★</span>
                ))}
              </div>
              <p className="font-display text-[20px] md:text-[22px] leading-[1.55] italic text-white/75">
                "{r.text}"
              </p>
              <div className="mt-10 flex flex-col items-center gap-2">
                <div className="w-8 h-[1px] bg-crown-gold/30" />
                <div className="text-[10px] tracking-[0.22em] uppercase text-white mt-3">{r.name}</div>
                <div className="text-[8px] opacity-30 uppercase tracking-widest text-white">{r.city}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
