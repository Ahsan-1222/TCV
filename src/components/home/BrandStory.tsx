import { motion } from 'framer-motion';

export const BrandStory = () => {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-4 md:mb-6"
        >
          Our Blueprint
        </motion.div>

        {/* Mobile layout */}
        <div className="md:hidden space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-[44px] sm:text-[56px] leading-[0.9] tracking-tight text-white"
          >
            The Art<br />
            <span className="italic font-light text-crown-gold">of Curation.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/3] sm:aspect-[3/4] w-full max-h-[420px] sm:max-h-none overflow-hidden rounded-sm bg-[#111]"
          >
            <img
              src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (1).jpeg')}`}
              alt="TCV Curation"
              className="w-full h-full object-cover object-center"
            />
            {/* Gold overlay strip */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-crown-gold" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 text-[13px] leading-[1.9] text-white/50 font-light"
          >
            <p>Inspired by international blueprints, we translate luxury into an accessible, premium reality for the discerning Pakistani clientele.</p>
            <p>Soft window photography, matte finishes, and highly polished accents. Every detail is meticulously considered.</p>
          </motion.div>

          <div className="flex items-center gap-10 border-t border-white/8 pt-6">
            {[['Est.', '2026'], ['Origin', 'Pakistan'], ['Products', '25+']].map(([label, val]) => (
              <div key={label}>
                <div className="font-display text-[28px] text-white leading-none">{val}</div>
                <div className="text-[8px] tracking-[0.28em] uppercase text-white/30 mt-1.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Text */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display text-[64px] lg:text-[90px] xl:text-[112px] leading-[0.88] tracking-tight text-white lg:-mr-16"
            >
              The Art<br />
              <span className="italic font-light text-crown-gold">of Curation.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mt-12 space-y-5 text-[14px] md:text-[15px] leading-[2] text-white/45 font-light max-w-[440px]"
            >
              <p>Inspired by international blueprints, we translate luxury schematics into an accessible, premium reality for the discerning clientele.</p>
              <p>Soft window photography, matte finishes, and highly polished accents. Every detail is meticulously considered, stripping away the unnecessary to reveal pure elegance.</p>
            </motion.div>

            <div className="mt-14 flex items-center gap-12 border-t border-white/8 pt-10">
              {[['Est.', '2026'], ['Origin', 'Pakistan'], ['Products', '25+']].map(([label, val]) => (
                <div key={label}>
                  <div className="font-display text-[36px] text-white leading-none">{val}</div>
                  <div className="text-[8px] tracking-[0.28em] uppercase text-white/30 mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="relative aspect-[4/3] sm:aspect-[3/4] w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto overflow-hidden order-1 lg:order-2 rounded-sm"
          >
            <img
              src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (1).jpeg')}`}
              alt="TCV Blueprint"
              className="w-full h-full object-cover object-center transition-transform duration-[3s] ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-crown-gold" />
            {/* Logo watermark */}
            <div className="absolute bottom-6 right-6 w-16 h-16 bg-white/10 backdrop-blur-md p-3 flex items-center justify-center rounded-full">
              <img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain brightness-0 invert opacity-80" />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
