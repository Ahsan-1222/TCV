import { motion } from 'framer-motion';

const reviews = [
  { name: 'Ayesha M.', city: 'Lahore', text: 'ROOH AVANT is my signature now. Luxury packaging and WhatsApp order made it so easy. COD delivered in 2 days.', rating: 5 },
  { name: 'Bilal K.', city: 'Karachi', text: 'The Crown Vault team curated perfectly. GOLD extrait lasts entire wedding. Highly polished gold bottle looks premium.', rating: 5 },
  { name: 'Sana J.', city: 'Islamabad', text: 'Bought bags and perfume combo. Matte black tote stitch quality is exceptional. Will reorder.', rating: 5 },
];

export const Testimonials = () => {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="font-display text-[32px] md:text-[42px] leading-none mb-6">Client Chronicles.</h2>
          <p className="text-[9px] tracking-[0.3em] uppercase opacity-40">The Curation Experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 md:gap-12">
          {reviews.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 1 }} className="flex flex-col items-center text-center px-4">
              <p className="font-display text-[20px] md:text-[22px] leading-[1.5] italic text-[#1A1A1A]">"{r.text}"</p>
              <div className="mt-12 flex flex-col items-center gap-3">
                <div className="w-8 h-[1px] bg-[#1A1A1A]/20 mb-2"></div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]">{r.name}</div>
                <div className="text-[8px] opacity-40 uppercase tracking-widest">{r.city}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
