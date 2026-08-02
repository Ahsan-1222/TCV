import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const heroSlides = [
  {
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (4).jpeg')}`,
    subtitle: 'The Crown Vault · Signature Collection',
    heading: 'ROOH Fragrances.',
    description: 'A meticulously curated collection of fine products, crafted for those who appreciate understated elegance and enduring quality.',
    cta: 'Explore Collection'
  },
  {
    image: 'https://i.etsystatic.com/33947445/r/il/b920da/7450829026/il_1588xN.7450829026_k26r.jpg',
    subtitle: 'Heritage · Timeless Pieces',
    heading: 'Modern Elegance',
    description: 'Preserving the legacy of artisanal craftsmanship. Aesthetic designs crafted to transcend generations.',
    cta: 'Discover Heritage'
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format',
    subtitle: 'Preview · Luxury Editions',
    heading: 'Curated Perfection',
    description: 'Discover timeless designs crafted to elevate your style with every detail.',
    cta: 'Shop Now'
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 7, ease: 'linear', opacity: { duration: 1.5 } }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroSlides[currentSlide].image}
            alt="Luxury Product"
            className="w-full h-full object-cover"
          />
          {/* Dark Vignette Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30 mix-blend-multiply"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center h-full pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col items-center max-w-[800px]"
          >
            <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/80 mb-6 font-medium">
              {heroSlides[currentSlide].subtitle}
            </span>
            
            <h1 className="font-display text-[42px] sm:text-[50px] md:text-[80px] lg:text-[100px] leading-[1.1] md:leading-[1] tracking-tight text-white mb-4 md:mb-6 px-4 md:px-0">
              {heroSlides[currentSlide].heading}
            </h1>
            
            <p className="text-[12px] sm:text-[13px] md:text-[15px] leading-relaxed tracking-wide text-white/90 max-w-[500px] mb-8 md:mb-10 font-light px-6 md:px-0">
              {heroSlides[currentSlide].description}
            </p>
            
            <Link 
              to="/shop" 
              className="mt-4 border border-white/30 text-white hover:bg-white hover:text-black px-12 py-4 text-[10px] md:text-[11px] uppercase tracking-[0.3em] transition-all duration-700 backdrop-blur-sm"
            >
              {heroSlides[currentSlide].cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicator (Valaura Style) */}
      <div className="absolute bottom-8 left-6 md:left-12 z-20 flex flex-col gap-1 text-[10px] tracking-[0.2em] text-white/70 uppercase">
        <span>Archive 0{currentSlide + 1} / 0{heroSlides.length}</span>
      </div>
      
      {/* Optional scroll indicator */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-white/70 uppercase">
        <span className="rotate-90 origin-right transform translate-x-3 mb-8">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 relative">
          <motion.div 
            animate={{ y: [0, 48, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-full h-1/3 bg-white absolute top-0 left-0"
          />
        </div>
      </div>
    </section>
  );
};
