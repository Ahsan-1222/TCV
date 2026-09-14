import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanners } from '../../hooks/useBanners';

/* ─────────────────────────────  CONFIG  ───────────────────────────── */

const AUTOPLAY_MS = 6000;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Slide = {
  subtitle?: string;
  heading?: string;
  description?: string;
  cta?: string;
  image?: string;
  link?: string;
};

const FALLBACK_SLIDE: Slide = {
  subtitle: 'The Crown Vault',
  heading: 'Curated Elegance',
  description: 'Experience refined luxury and unmatched craftsmanship across our collections.',
  cta: 'Explore Collection',
  image: '/assets/banners/hero-perfumes.jpg',
  link: '/shop',
};

const resolveTarget = (slide: Slide) => {
  if (slide.link) return slide.link;
  const haystack = `${slide.heading ?? ''} ${slide.subtitle ?? ''} ${slide.cta ?? ''} ${slide.image ?? ''}`.toLowerCase();
  if (/(perfume|fragrance|rooh)/.test(haystack)) return '/categories/perfume';
  if (/(watch|horology|timepiece)/.test(haystack)) return '/categories/watches';
  if (/(bag|leather|tote)/.test(haystack)) return '/categories/bags';
  return '/shop';
};

/* ─────────────────────────────  ICONS  ───────────────────────────── */

const ArrowRight = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PauseIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <rect x="7" y="6" width="3.2" height="12" rx="1" />
    <rect x="13.8" y="6" width="3.2" height="12" rx="1" />
  </svg>
);

const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8.5 5.6c0-.9 1-1.5 1.8-1l8 5.4c.7.5.7 1.5 0 2l-8 5.4c-.8.5-1.8-.1-1.8-1V5.6Z" />
  </svg>
);

/* ───────────────────────────  VARIANTS  ─────────────────────────── */

const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const wordVariants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const contentVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 36 : -36 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: EASE_OUT, staggerChildren: 0.07, delayChildren: 0.08 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -20 : 20,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
  }),
};

/* ────────────────────────────  COMPONENT  ──────────────────────────── */

export const Hero = () => {
  const banners = useBanners() as Slide[] | undefined;
  const prefersReducedMotion = useReducedMotion();

  const slides = useMemo<Slide[]>(
    () => (banners && banners.length > 0 ? banners : [FALLBACK_SLIDE]),
    [banners],
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const slide = slides[index] ?? slides[0] ?? FALLBACK_SLIDE;
  const canAutoplay = slides.length > 1 && !prefersReducedMotion;

  /* Keep the index valid if the banner list changes. */
  useEffect(() => {
    setIndex((i) => (i >= slides.length ? 0 : i));
  }, [slides.length]);

  /* Preload every frame once so transitions are instant. */
  useEffect(() => {
    slides.forEach((s) => {
      if (!s.image) return;
      const img = new Image();
      img.src = s.image;
    });
  }, [slides]);

  /* Navigation ------------------------------------------------------- */
  const go = useCallback(
    (dir: number) => {
      setDirection(dir);
      setIndex((prev) => (prev + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  const jumpTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index],
  );

  /* ─── AUTOPLAY ──────────────────────────────────────────────────────
     A single interval drives the slideshow. It resets whenever the
     index changes (manual or automatic) or when play/pause toggles,
     so the timer is always in sync with the visible slide.
  ───────────────────────────────────────────────────────────────────── */
  const progress = useMotionValue(0);
  const progressControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!canAutoplay) {
      progress.set(0);
      return;
    }

    /* Reset + restart the thin progress bar animation */
    progressControlsRef.current?.stop();
    progress.set(0);
    progressControlsRef.current = animate(progress, 1, {
      duration: AUTOPLAY_MS / 1000,
      ease: 'linear',
    });

    /* If paused, hold the slide; otherwise schedule the next one. */
    if (paused) {
      progressControlsRef.current.pause();
      return () => progressControlsRef.current?.stop();
    }

    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS);

    return () => {
      window.clearTimeout(timer);
      progressControlsRef.current?.stop();
    };
  }, [index, paused, canAutoplay, go, progress]);

  /* Keyboard --------------------------------------------------------- */
  useEffect(() => {
    if (slides.length <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, slides.length]);

  /* Swipe ------------------------------------------------------------ */
  const handleDragEnd = useCallback(
    (_event: unknown, info: PanInfo) => {
      if (slides.length <= 1) return;
      const power = info.offset.x + info.velocity.x * 0.2;
      if (power < -70) go(1);
      else if (power > 70) go(-1);
    },
    [go, slides.length],
  );

  /* Motion variants (reduced-motion aware) --------------------------- */
  const mediaVariants = useMemo(
    () => ({
      enter: { opacity: 0, scale: prefersReducedMotion ? 1 : 1.07 },
      center: {
        opacity: 1,
        scale: 1,
        transition: {
          opacity: { duration: 0.9, ease: 'easeInOut' as const },
          scale: { duration: 1.8, ease: EASE_OUT },
        },
      },
      exit: { opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' as const } },
    }),
    [prefersReducedMotion],
  );

  const words = (slide.heading ?? '').split(' ').filter(Boolean);
  const total = String(slides.length).padStart(2, '0');

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) go(1);
      else go(-1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative isolate w-full select-none overflow-hidden bg-black text-white antialiased"
    >
      {/* ═════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT (< md):
          Full banner image visibility with 16:9 ratio, zero cropping,
          touch swipe, and refined editorial typography below
         ═════════════════════════════════════════════════════════════════════ */}
      <div
        className="block md:hidden w-full bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Full uncropped banner image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-b from-[#161616] to-[#0A0A0A] flex items-center justify-center border-b border-white/10">
          {/* Ambient ambient glow from the current banner */}
          {slide.image && (
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-2xl opacity-25 scale-125"
            />
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={slide.image}
                alt={slide.heading ?? 'Banner'}
                draggable={false}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className="pointer-events-none h-full w-full object-contain object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* Vignette shadow at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Slide counter badge */}
          <span className="absolute top-3 right-3 border border-white/20 bg-black/60 px-2.5 py-1 text-[9px] tabular-nums tracking-[0.2em] text-white/80 backdrop-blur-md">
            {String(index + 1).padStart(2, '0')} / {total}
          </span>
        </div>

        {/* Text & Actions area below the banner */}
        <div className="px-5 pt-5 pb-5 sm:px-8 bg-black">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              {/* Kicker */}
              <div className="mb-2 flex items-center gap-3">
                <span className="h-px w-6 bg-crown-gold/70 inline-block" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-crown-gold">
                  {slide.subtitle}
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-display text-[26px] sm:text-[34px] font-normal leading-[1.08] tracking-[-0.01em] text-white">
                {slide.heading}
              </h1>

              {/* Description */}
              {slide.description && (
                <p className="mt-2 text-[12.5px] sm:text-[13.5px] font-light leading-relaxed text-white/70">
                  {slide.description}
                </p>
              )}

              {/* Action row with CTA & Controls */}
              <div className="mt-5 flex items-center justify-between gap-4">
                <Link
                  to={resolveTarget(slide)}
                  className="inline-flex items-center gap-2.5 bg-crown-gold text-black px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] shadow-[0_4px_14px_rgba(201,168,106,0.25)] hover:bg-crown-gold-dark transition-colors"
                >
                  {slide.cta || 'Explore'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {/* Arrow navigation + Play/Pause */}
                <div className="flex items-center gap-2">
                  {canAutoplay && (
                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? 'Play' : 'Pause'}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 active:scale-95 transition-colors"
                    >
                      {paused ? <PlayIcon className="h-2.5 w-2.5" /> : <PauseIcon className="h-2.5 w-2.5" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    disabled={slides.length <= 1}
                    aria-label="Previous slide"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 active:scale-95 disabled:opacity-30 transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    disabled={slides.length <= 1}
                    aria-label="Next slide"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 active:scale-95 disabled:opacity-30 transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="mt-4 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1 transition-all duration-300 ${
                      i === index ? 'w-7 bg-crown-gold' : 'w-2 bg-white/25 rounded-full'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] w-full bg-white/10">
          {canAutoplay && (
            <motion.div style={{ scaleX: progress }} className="h-full w-full origin-left bg-crown-gold" />
          )}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT (md: and above):
          Full-height immersive editorial presentation with masked reveal
         ═════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative h-[90vh] min-h-[660px] max-h-[1000px] w-full">
        {/* ── MEDIA (swipeable) ─────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
          drag={slides.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.07}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              variants={mediaVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
              aria-hidden="true"
            >
              <img
                src={slide.image}
                alt=""
                draggable={false}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className="pointer-events-none h-full w-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── SCRIMS ───────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────── */}
        <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-[1500px] flex-col justify-center px-6 pb-32 pt-32 sm:px-10 lg:px-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-[660px]"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              {/* Kicker */}
              <motion.div variants={itemVariants} className="mb-5 flex items-center gap-4 md:mb-6">
                <span className="h-px w-10 bg-crown-gold/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold md:text-[11px]">
                  {slide.subtitle}
                </span>
              </motion.div>

              {/* Heading — masked word-by-word reveal */}
              <motion.h1
                variants={headingVariants}
                className="font-display text-[clamp(2.5rem,5.5vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]"
              >
                {words.map((word, i) => (
                  <span key={`${word}-${i}`} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span variants={wordVariants} className="inline-block will-change-transform">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-[46ch] text-[14px] font-light leading-relaxed text-white/75 md:mt-7 md:text-[15px] md:leading-[1.85]"
              >
                {slide.description}
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants} className="mt-9 flex flex-wrap items-center gap-5 md:mt-11">
                <Link
                  to={resolveTarget(slide)}
                  className="group pointer-events-auto relative isolate inline-flex items-center gap-3 overflow-hidden border border-crown-gold/60 px-8 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-md transition-colors duration-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:px-10 md:py-4 md:text-[11px]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 translate-y-full bg-crown-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                  />
                  {slide.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── CONTROLS ─────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-6 pb-6 sm:px-10 lg:px-16">
            {/* Counter + dots */}
            <div className="pointer-events-auto flex items-center gap-5">
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-[11px] font-medium tracking-[0.3em] text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-8 bg-white/25" />
                <span className="text-[11px] font-medium tracking-[0.3em] text-white/45">{total}</span>
              </div>

              {/* Dot navigation */}
              <div className="hidden items-center gap-2 sm:flex">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 transition-all duration-500 ${
                      i === index
                        ? 'w-8 bg-crown-gold shadow-[0_0_8px_#C9A86A]'
                        : 'w-2 rounded-full bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Arrows + play/pause */}
            <div className="pointer-events-auto flex items-center gap-2">
              {canAutoplay && (
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                  className="mr-1 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition duration-300 hover:border-crown-gold/70 hover:text-crown-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70"
                >
                  {paused ? <PlayIcon className="h-3 w-3" /> : <PauseIcon className="h-3 w-3" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => go(-1)}
                disabled={slides.length <= 1}
                aria-label="Previous slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/75 transition duration-300 hover:border-crown-gold hover:text-crown-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70 disabled:pointer-events-none disabled:opacity-30 md:h-11 md:w-11"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={slides.length <= 1}
                aria-label="Next slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/75 transition duration-300 hover:border-crown-gold hover:text-crown-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70 disabled:pointer-events-none disabled:opacity-30 md:h-11 md:w-11"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Autoplay progress bar */}
          <div className="h-px w-full bg-white/[0.12]">
            {canAutoplay && (
              <motion.div style={{ scaleX: progress }} className="h-full w-full origin-left bg-crown-gold" />
            )}
          </div>
        </div>

        {/* Hidden live region for screen readers */}
        <p className="sr-only" aria-live="polite">
          {`Slide ${index + 1} of ${slides.length}: ${slide.heading ?? ''}`}
        </p>
      </div>
    </section>
  );
};