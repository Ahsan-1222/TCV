import { Hero } from '../components/home/Hero';
import { motion } from 'framer-motion';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { BrandStory } from '../components/home/BrandStory';
import { Testimonials } from '../components/home/Testimonials';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';

export const Home = () => {
  const products = useProducts();
  const featured = products.filter(p => p.featured).slice(0, 8);
  const bestSellers = products.filter(p => p.bestSeller);

  return (
    <div>
      <Hero />
      <FeaturedCategories />

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-32">
        <ProductGrid products={featured} title="Featured Fragrances" />
        <div className="mt-16 text-center">
          <Link to="/shop" className="inline-flex border border-black/20 px-10 py-4 text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500">View All Products</Link>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-24 md:py-40 bg-[#FAFAFA]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-white shadow-xl">
              <img src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (4).jpeg')}`} alt="Bundle" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] hover:scale-105" />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="flex flex-col justify-center mt-8 md:mt-0">
              <h3 className="font-display text-[40px] md:text-[72px] leading-[1] text-[#1A1A1A] tracking-[-0.02em]">
                The Signature<br />
                <span className="italic font-light text-crown-gold">Trio.</span>
              </h3>
              <p className="text-[13px] leading-8 text-[#1A1A1A]/60 mt-8 max-w-[400px]">
                A curated selection of our finest fragrances: AQUA, AVANT, and NOIR. Encased in a premium gift box, designed for the minimalist.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <span className="text-xl tracking-widest text-[#1A1A1A]">Rs. 6,950</span>
                <span className="line-through text-[#1A1A1A]/30 text-xs tracking-widest">Rs. 12,000</span>
              </div>
              <Link to="/shop" className="mt-12 inline-flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A] group w-fit">
                <span className="border-b border-[#1A1A1A]/30 pb-1 group-hover:border-[#1A1A1A] group-hover:pr-4 transition-all duration-500">Shop The Bundle</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-20 md:py-32">
        <ProductGrid products={bestSellers} title="Best Sellers" />
      </section>

      <BrandStory />
      <Testimonials />
    </div>
  );
};
