import { motion } from 'framer-motion';

const stats = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'WA', label: 'WhatsApp Orders' },
  { value: '2026', label: 'Established' },
  { value: 'PK', label: 'Origin · Pakistan' },
];

export const About = () => {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-4">Our Blueprint</div>
              <h1 className="font-display text-[48px] sm:text-[64px] md:text-[80px] leading-[0.88] text-white tracking-tight">
                The Crown<br />
                <span className="italic font-light text-crown-gold">Vault.</span>
              </h1>
              <div className="mt-8 space-y-5 text-[13px] sm:text-[14px] leading-[1.95] text-white/45 font-light max-w-[500px]">
                <p>THE CROWN VAULT is luxury curations adapted for Pakistan. We operate on four pillars: Perfume — primary focus, Bags — handbag collection, Watches — timepiece layout, Jewellery — fine pieces.</p>
                <p>Every product shot follows soft window photography, macro texture shots, and white marble staging. From stitch count in our office totes to fine chain gauge in our pendants, we obsess over detail.</p>
                <p>ROOH Fragrances is our flagship perfume house — AQUA, AVANT, NOIR, GOLD, and VELVET. Each an olfactory story, long-lasting and luxurious.</p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <img
                src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.51 PM (1).jpeg')}`}
                alt="ROOH Gold Velvet"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-crown-gold" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-t border-b border-white/8 bg-[#111111]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="py-8 md:py-10 px-6 md:px-10 text-center"
              >
                <div className="font-display text-[28px] md:text-[36px] text-white leading-none">{s.value}</div>
                <div className="text-[9px] tracking-[0.28em] uppercase text-white/30 mt-2">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand pillars */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-6">What We Offer</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {[
            { title: 'Perfumes', sub: 'Primary Focus', desc: 'ROOH Fragrances — AQUA, AVANT, NOIR, GOLD, VELVET. Extrait concentration, long-lasting projection.' },
            { title: 'Bags', sub: 'Ladies Collection', desc: 'Structured office totes, evening clutches and crossbody designs. Premium stitch quality.' },
            { title: 'Jewellery', sub: 'Fine Pieces', desc: 'Highly polished gold, diamond dust settings. Pendant chains, ear pieces, and sets.' },
            { title: 'Bundles', sub: 'Gift Ready', desc: 'Curated gift boxes. The Signature Trio and seasonal collections, COD available.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-[#0E0E0E] p-7 md:p-8"
            >
              <div className="text-[8px] tracking-[0.35em] uppercase text-crown-gold mb-3">{item.sub}</div>
              <h3 className="font-display text-[24px] text-white mb-3">{item.title}</h3>
              <p className="text-[12px] leading-[1.8] text-white/35">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
