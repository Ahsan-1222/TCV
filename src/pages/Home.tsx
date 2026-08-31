import { Hero } from '../components/home/Hero';
import { motion } from 'framer-motion';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { BrandStory } from '../components/home/BrandStory';
import { Testimonials } from '../components/home/Testimonials';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { trioBundleProduct } from '../data/products';
import { Link } from 'react-router-dom';

export const Home = () => {
  const products = useProducts();
  const { addToCart } = useCart();
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

            {/* 3D 100% Responsive Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              whileHover={{ rotateY: -3, rotateX: 2, scale: 1.02 }}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10] max-h-[500px] overflow-hidden rounded-md border border-crown-gold/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(201,168,106,0.18)] transition-all duration-500 bg-[#0E0E0E] [perspective:1000px] flex items-center justify-center"
            >
              <img
                src="/assets/products/trio-bundle.jpg"
                alt="Signature Trio Bundle"
                className="w-full h-full object-cover object-center contrast-[1.06] brightness-[1.03] transition-transform duration-700 hover:scale-105 max-w-full block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-white/5 pointer-events-none" />
              <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 bg-black/85 backdrop-blur-md border border-crown-gold/40 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-sm text-[8px] sm:text-[10px] tracking-[0.2em] uppercase text-crown-gold font-semibold shadow-lg z-10">
                Exclusive Bundle · Rs. 5,450
              </div>
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
                A curated selection of our finest fragrances: BLOOM, VELVET SPICE, and NOIR. Encased in a premium gift box, designed for the minimalist.
              </p>
              <div className="mt-7 flex items-baseline gap-4">
                <span className="font-display text-[26px] text-white">Rs. 5,450</span>
                <span className="line-through text-white/25 text-[13px] tracking-widest">Rs. 10,499</span>
                <span className="text-crown-gold text-[10px] tracking-widest uppercase">Save 48%</span>
              </div>
              <button
                onClick={() => addToCart(trioBundleProduct)}
                className="mt-8 inline-flex items-center gap-4 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#0A0A0A] bg-crown-gold hover:bg-white px-8 py-3.5 font-semibold transition-all duration-300 shadow-lg hover:shadow-crown-gold/20 group w-fit cursor-pointer rounded-sm"
              >
                <span>Shop The Bundle</span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
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
