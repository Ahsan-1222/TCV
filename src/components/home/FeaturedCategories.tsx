import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cats = [
  {
    title: 'Perfume',
    desc: 'Signature Scent Positioning • Gift Box Integration',
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (2).jpeg')}`,
    slug: 'perfume',
    count: '5 Scents',
    color: 'from-[#0A0A0A]/70 to-transparent',
  },
  {
    title: 'Bags',
    desc: 'Structured Office Totes • Evening Clutch Collection',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format',
    slug: 'bags',
    count: '12 Designs',
    color: 'from-[#0A0A0A]/60 to-transparent',
  },
  {
    title: 'Jewellery',
    desc: 'Highly Polished Gold • Diamond Dust Setting',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format',
    slug: 'jewellery',
    count: '8 Pieces',
    color: 'from-[#C9A86A]/80 to-transparent',
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3 text-crown-gold">Curated Departments</div>
          <h2 className="font-display text-[32px] md:text-[48px] leading-none text-[#1A1A1A]">Shop By Category</h2>
        </div>
        <Link to="/shop" className="hidden md:inline-flex text-[11px] tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-crown-gold hover:border-crown-gold transition-colors">View All Collections</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 md:gap-12 lg:gap-20 items-start mt-12 md:mt-24">
        {cats.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 1, delay: i * 0.2 }} className={`group block cursor-pointer ${i === 1 ? 'md:mt-40' : ''} ${i === 2 ? 'md:mt-16' : ''}`}>
            <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[3/4]' : i === 1 ? 'aspect-[4/5]' : 'aspect-[2/3]'} bg-[#FAF9F6]`}>
              <Link to={`/categories/${c.slug}`}>
                <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" />
              </Link>
            </div>
            
            <div className="mt-8 text-center md:text-left flex flex-col items-center md:items-start">
              <span className="text-[9px] tracking-[0.2em] uppercase text-crown-gold mb-3">{c.count}</span>
              <h3 className="font-display text-[#1A1A1A] text-[28px] md:text-[36px] tracking-wide mb-3 group-hover:text-crown-gold transition-colors duration-500">{c.title}</h3>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 max-w-[220px] leading-[1.8]">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
