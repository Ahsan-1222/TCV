import { motion } from 'framer-motion';

export const BrandStory = () => {
  return (
    <section className="bg-[#FAF9F6] text-[#1A1A1A] relative overflow-hidden py-24 md:py-32">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Typography Side */}
          <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="font-display text-[48px] sm:text-[60px] md:text-[80px] lg:text-[120px] leading-[0.85] tracking-[-0.02em] lg:-mr-40 drop-shadow-2xl text-[#1A1A1A]">
              The Art<br />
              <span className="italic font-light text-crown-gold">of Curation.</span>
            </motion.h2>
            
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="mt-16 space-y-8 text-[13px] md:text-[15px] leading-[2.2] text-[#1A1A1A]/70 font-light max-w-[450px]">
              <p>Inspired by international blueprints, we translate luxury schematics into an accessible, premium reality for the discerning clientele.</p>
              <p>Soft window photography, matte finishes, and highly polished accents. Every detail is meticulously considered, stripping away the unnecessary to reveal pure elegance.</p>
            </motion.div>
            
            <div className="mt-12 md:mt-16 flex items-center gap-8 md:gap-12 border-t border-[#1A1A1A]/10 pt-8 md:pt-12">
              <div>
                <div className="font-display text-4xl">Est.</div>
                <div className="text-[9px] tracking-[0.2em] uppercase opacity-50 mt-3">2026</div>
              </div>
              <div>
                <div className="font-display text-4xl">Lahore</div>
                <div className="text-[9px] tracking-[0.2em] uppercase opacity-50 mt-3">Origin</div>
              </div>
            </div>
          </div>

          {/* Magazine Image Side */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} className="relative aspect-[3/4] w-full max-w-[550px] mx-auto lg:mx-0 lg:ml-auto overflow-hidden bg-white order-1 lg:order-2 shadow-2xl">
            <img src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (1).jpeg')}`} alt="TCV Blueprint" className="w-full h-full object-cover transition-transform duration-[3s] ease-out hover:scale-110" />
            {/* The Logo Overlay */}
            <div className="absolute bottom-8 right-8 w-24 h-24 backdrop-blur-lg p-4 flex items-center justify-center rounded-full shadow-2xl mix-blend-screen">
              <img src="/logo.jpg" alt="TCV Logo" className="w-full h-full object-contain mix-blend-multiply opacity-100" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
