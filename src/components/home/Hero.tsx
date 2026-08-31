import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useBanners } from '../../hooks/useBanners';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = useBanners();

  // Preload all banner images in memory for instant zero-delay smooth switching
  useEffect(() => {
    if (!heroSlides || heroSlides.length === 0) return;
    heroSlides.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, [heroSlides]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide] || heroSlides[0];

  const getSlideTarget = (s: typeof slide) => {
    if (s.link) return s.link;
    const text = `${s.heading || ''} ${s.subtitle || ''} ${s.cta || ''} ${s.image || ''}`.toLowerCase();
    if (text.includes('perfume') || text.includes('fragrance') || text.includes('rooh')) {
      return '/categories/perfume';
    }
    if (text.includes('watch') || text.includes('horology') || text.includes('timepiece')) {
      return '/categories/watches';
    }
    if (text.includes('bag') || text.includes('leather') || text.includes('tote')) {
      return '/categories/bags';
    }
    return '/shop';
  };

  return (
    <section className="relative w-full overflow-hidden bg-black select-none">
      {/* ── MOBILE LAYOUT (< md) ── */}
      <div className="md:hidden flex flex-col">
        {/* Image container with fixed responsive aspect ratio for 100% responsiveness */}
        <div className="relative w-full h-[62vw] sm:h-[52vw] min-h-[270px] max-h-[480px] bg-black overflow-hidden shadow-2xl">
          {heroSlides.map((s, index) => (
            <motion.div
              key={`mob-img-${index}`}
              initial={false}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? [1.06, 1] : 1.06,
              }}
              transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 pointer-events-none"
            >
              <img
                src={s.image}
                alt={s.heading || 'Hero Banner'}
                loading="eager"
                className="w-full h-full object-cover object-center transform-gpu"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
            </motion.div>
          ))}
          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Text block below image with fixed min-height for smooth text transitions */}
        <div className="bg-black text-white px-5 pt-5 pb-8 flex flex-col items-center text-center relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mob-text-${currentSlide}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center w-full"
            >
              <span className="text-[9px] tracking-[0.3em] uppercase text-crown-gold mb-2 font-semibold">
                {slide.subtitle}
              </span>
              <h1 className="font-display text-[26px] sm:text-[32px] leading-[1.05] tracking-tight text-white mb-2.5 font-semibold drop-shadow-md">
                {slide.heading}
              </h1>
              <p className="text-[12px] leading-relaxed text-white/80 max-w-[340px] mb-5 font-light">
                {slide.description}
              </p>
              <Link
                to={getSlideTarget(slide)}
                className="border border-crown-gold/60 text-white bg-crown-gold/10 px-8 py-2.5 text-[10px] uppercase tracking-[0.28em] font-medium hover:bg-crown-gold hover:text-black transition-all duration-500 shadow-lg"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex gap-2.5 mt-6">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-500 ${i === currentSlide ? 'w-8 h-1.5 bg-crown-gold shadow-[0_0_8px_#C9A86A]' : 'w-2 h-1.5 bg-white/30 rounded-full'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (md+) ── */}
      <div className="hidden md:block relative h-[82vh] min-h-[540px] max-h-[840px] overflow-hidden bg-black">
        {heroSlides.map((s, index) => (
          <motion.div
            key={`desk-img-${index}`}
            initial={false}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <img
              src={s.image}
              alt={s.heading || 'Hero Banner'}
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
            {/* Clean luxury gradient overlay for maximum readability and crisp photo contrast */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
          </motion.div>
        ))}

        {/* Desktop content overlay with 3D float depth */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desk-text-${currentSlide}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="flex flex-col items-center max-w-[840px]"
            >
              <span className="text-[11px] tracking-[0.35em] uppercase text-crown-gold mb-5 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {slide.subtitle}
              </span>
              <h1 className="font-display text-[62px] lg:text-[92px] xl:text-[112px] leading-[0.98] tracking-tight text-white mb-6 drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]">
                {slide.heading}
              </h1>
              <p className="text-[15px] leading-relaxed text-white/90 max-w-[520px] mb-10 font-light drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {slide.description}
              </p>
              <Link
                to={getSlideTarget(slide)}
                className="border border-crown-gold/50 text-white bg-black/40 px-12 py-4 text-[11px] uppercase tracking-[0.32em] font-semibold hover:bg-crown-gold hover:text-black hover:border-crown-gold transition-all duration-500 backdrop-blur-md shadow-2xl hover:shadow-[0_0_30px_rgba(201,168,106,0.4)]"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-500 ${i === currentSlide ? 'w-10 h-1.5 bg-crown-gold shadow-[0_0_10px_#C9A86A]' : 'w-2 h-1.5 bg-white/40 rounded-full'}`}
            />
          ))}
        </div>

        {/* Archive counter */}
        <div className="absolute bottom-8 left-6 md:left-12 z-20 text-[10px] tracking-[0.25em] text-white/70 uppercase font-medium">
          Archive 0{currentSlide + 1} / 0{heroSlides.length}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-12 z-20 flex flex-col items-center gap-2 text-[10px] tracking-[0.2em] text-white/70 uppercase">
          <span className="rotate-90 origin-right transform translate-x-3 mb-8">Scroll</span>
          <div className="w-[1px] h-12 bg-white/25 relative">
            <motion.div
              animate={{ y: [0, 48, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-full h-1/3 bg-crown-gold absolute top-0 left-0 shadow-[0_0_8px_#C9A86A]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
