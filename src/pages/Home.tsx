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
    <div className="bg-[#0A0A0A]">
      <Hero />
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-28">
        <ProductGrid products={featured} title="Featured Fragrances" />
        <div className="mt-10 md:mt-16 text-center">
          <Link
            to="/shop"
            className="inline-flex border border-white/20 text-white px-10 py-3.5 text-[10px] tracking-[0.3em] uppercase hover:bg-crown-gold hover:border-crown-gold hover:text-[#0A0A0A] transition-all duration-500"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Signature Trio Promo */}
      <section className="bg-[#111111] border-t border-b border-white/5 py-14 md:py-28">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative w-full aspect-[4/3] sm:aspect-square md:aspect-[4/5] max-h-[440px] sm:max-h-none overflow-hidden rounded-sm"
            >
              <img
                src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (4).jpeg')}`}
                alt="Signature Trio Bundle"
                className="w-full h-full object-cover object-center transition-transform duration-[3s] hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/40 to-transparent pointer-events-none" />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-4">Curated Bundle</div>
              <h3 className="font-display text-[38px] sm:text-[48px] md:text-[64px] leading-[0.95] text-white tracking-tight">
                The Signature<br />
                <span className="italic font-light text-crown-gold">Trio.</span>
              </h3>
              <p className="text-[13px] leading-[1.9] text-white/45 mt-6 max-w-[400px]">
                A curated selection of our finest fragrances: AQUA, AVANT, and NOIR. Encased in a premium gift box, designed for the minimalist.
              </p>
              <div className="mt-7 flex items-baseline gap-4">
                <span className="font-display text-[26px] text-white">Rs. 6,950</span>
                <span className="line-through text-white/25 text-[13px] tracking-widest">Rs. 12,000</span>
                <span className="text-crown-gold text-[10px] tracking-widest uppercase">Save 42%</span>
              </div>
              <Link
                to="/shop"
                className="mt-8 inline-flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-white group w-fit"
              >
                <span className="border-b border-white/20 pb-1 group-hover:border-crown-gold group-hover:text-crown-gold group-hover:pr-3 transition-all duration-500">
                  Shop The Bundle
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-crown-gold">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-28">
        <ProductGrid products={bestSellers} title="Best Sellers" />
      </section>

      <BrandStory />
      <Testimonials />
    </div>
  );
};
