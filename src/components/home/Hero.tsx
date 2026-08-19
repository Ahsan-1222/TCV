import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { BannerSlide } from '../../pages/admin/BannerAdmin';

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (4).jpeg')}`,
    subtitle: 'The Crown Vault · Signature Collection',
    heading: 'ROOH Fragrances.',
    description: 'A meticulously curated collection of fine products, crafted for those who appreciate understated elegance and enduring quality.',
    cta: 'Explore Collection',
  },
  {
    image: 'https://i.etsystatic.com/33947445/r/il/b920da/7450829026/il_1588xN.7450829026_k26r.jpg',
    subtitle: 'Heritage · Timeless Pieces',
    heading: 'Modern Elegance',
    description: 'Preserving the legacy of artisanal craftsmanship. Aesthetic designs crafted to transcend generations.',
    cta: 'Discover Heritage',
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format',
    subtitle: 'Preview · Luxury Editions',
    heading: 'Curated Perfection',
    description: 'Discover timeless designs crafted to elevate your style with every detail.',
    cta: 'Shop Now',
  },
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_hero_banners');
      return saved ? JSON.parse(saved) : DEFAULT_SLIDES;
    } catch {
      return DEFAULT_SLIDES;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tcv_hero_banners');
      if (saved) setHeroSlides(JSON.parse(saved));
    } catch {
      // fallback to defaults
    }
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="md:hidden flex flex-col">
        {/* Image container with fixed responsive aspect ratio so container size never jumps */}
        <div className="relative w-full h-[52vw] sm:h-[45vw] min-h-[250px] max-h-[440px] bg-black overflow-hidden">
          {heroSlides.map((s, index) => (
            <motion.div
              key={`mob-img-${index}`}
              initial={false}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none"
            >
              <img
                src={s.image}
                alt="Luxury Banner"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ))}
          {/* subtle gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Text block below image with fixed min-height for smooth text transitions */}
        <div className="bg-black text-white px-5 pt-5 pb-8 flex flex-col items-center text-center relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-text-${currentSlide}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-[9px] tracking-[0.28em] uppercase text-crown-gold mb-2 font-medium">
                {slide.subtitle}
              </span>
              <h1 className="font-display text-[26px] sm:text-[30px] leading-[1.1] tracking-tight text-white mb-2.5 font-semibold">
                {slide.heading}
              </h1>
              <p className="text-[12px] leading-relaxed text-white/80 max-w-[340px] mb-5 font-light">
                {slide.description}
              </p>
              <Link
                to="/shop"
                className="border border-white/40 text-white px-8 py-2.5 text-[10px] uppercase tracking-[0.28em] hover:bg-white hover:text-black transition-all duration-500"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex gap-2 mt-5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 ${i === currentSlide ? 'w-7 h-1 bg-crown-gold' : 'w-1.5 h-1 bg-white/30 rounded-full'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (md+) ── */}
      <div className="hidden md:block relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
        {heroSlides.map((s, index) => (
          <motion.div
            key={`desk-img-${index}`}
            initial={false}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <img
              src={s.image}
              alt="Luxury Banner"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />
          </motion.div>
        ))}

        {/* Desktop content overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desk-text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center max-w-[800px]"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-crown-gold mb-5 font-medium">
                {slide.subtitle}
              </span>
              <h1 className="font-display text-[60px] lg:text-[90px] xl:text-[110px] leading-[1] tracking-tight text-white mb-5 drop-shadow-md">
                {slide.heading}
              </h1>
              <p className="text-[14px] leading-relaxed text-white/90 max-w-[480px] mb-10 font-light drop-shadow">
                {slide.description}
              </p>
              <Link
                to="/shop"
                className="border border-white/40 text-white px-12 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-700 backdrop-blur-sm"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 ${i === currentSlide ? 'w-8 h-1.5 bg-crown-gold' : 'w-1.5 h-1.5 bg-white/40 rounded-full'}`}
            />
          ))}
        </div>

        {/* Archive counter */}
        <div className="absolute bottom-8 left-6 md:left-12 z-20 text-[10px] tracking-[0.2em] text-white/70 uppercase">
          Archive 0{currentSlide + 1} / 0{heroSlides.length}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-12 z-20 flex flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-white/70 uppercase">
          <span className="rotate-90 origin-right transform translate-x-3 mb-8">Scroll</span>
          <div className="w-[1px] h-12 bg-white/25 relative">
            <motion.div
              animate={{ y: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full h-1/3 bg-crown-gold absolute top-0 left-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
