import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ScrollParallax } from '../components/ui/ScrollParallax';

/* ─────────────────────────────  DATA  ───────────────────────────── */

const marquee = ['PERFUMES', 'BAGS', 'WATCHES', 'BUNDLES', 'COD', 'PAKISTAN', 'ROOH FRAGRANCES'];

const stats = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'WA', label: 'WhatsApp Orders' },
  { value: '2026', label: 'Established' },
  { value: 'PK', label: 'Origin · Pakistan' },
];

const chapters = [
  {
    n: '01',
    title: 'Perfumes',
    tag: 'Primary Focus',
    desc: 'ROOH Fragrances — BLOOM, VELVET SPICE, and NOIR. Extrait concentration, long-lasting projection, and a story in every note.',
    href: '/categories/perfume',
  },
  {
    n: '02',
    title: 'Bags',
    tag: 'Ladies Collection',
    desc: 'Structured office totes, evening clutches and crossbody designs. Premium stitch quality, hand-finished edges.',
    href: '/categories/bags',
  },
  {
    n: '03',
    title: 'Watches',
    tag: 'Timepiece Layout',
    desc: 'Precision craftsmanship, luxury stainless steel bezels, and elegant mesh straps built to outlast trends.',
    href: '/categories/watches',
  },
  {
    n: '04',
    title: 'Bundles',
    tag: 'Gift Ready',
    desc: 'Curated gift boxes. The Signature Trio and seasonal collections, cash on delivery available nationwide.',
    href: '/shop',
  },
];

/* ───────────────────────────  VARIANTS  ─────────────────────────── */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const riseIn = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
};

const wordIn = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 1, ease: EASE_OUT } },
};

/* ────────────────────────────  ICONS  ──────────────────────────── */

const ArrowUpRight = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const Asterisk = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ────────────────────────────  MARQUEE  ──────────────────────────── */

const Marquee = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];

  return (
    <div className="relative flex overflow-hidden py-5 select-none">
      <motion.div
        className="flex shrink-0 items-center gap-10 pr-10"
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
      >
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center gap-10">
            <span className="font-display text-[15px] font-normal uppercase tracking-[0.34em] text-white/70 md:text-[17px]">
              {item}
            </span>
            <Asterisk className="h-3 w-3 text-crown-gold/70" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/* ────────────────────────────  COMPONENT  ──────────────────────────── */

export const About = () => {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#080808] text-white antialiased">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── EDITORIAL HERO ───────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-[1560px] px-5 pt-16 sm:px-8 md:pt-24 lg:px-14">
          {/* Top meta row */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-between gap-6 border-b border-white/10 pb-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-1.5 w-1.5 place-items-center rounded-full bg-crown-gold" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/55">
                About · The Crown Vault
              </span>
            </div>
            <span className="hidden text-[9px] uppercase tracking-[0.42em] text-white/30 sm:block">
              Est. 2026 · Karachi, PK
            </span>
          </motion.div>

          {/* Oversized display headline */}
          <div className="relative pt-10 md:pt-14">
            <motion.h1
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              initial={reduce ? 'visible' : 'hidden'}
              animate="visible"
              className="font-display text-[clamp(3rem,13vw,10.5rem)] font-normal leading-[0.86] tracking-[-0.035em] text-white"
            >
              <span className="block overflow-hidden">
                <motion.span variants={wordIn} className="block">A house of</motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordIn} className="block pl-[8vw] italic font-light text-crown-gold md:pl-[14vw]">
                  quiet luxury
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={wordIn} className="block">for Pakistan.</motion.span>
              </span>
            </motion.h1>
          </div>

          {/* Asymmetric intro row */}
          <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
            <motion.div
              variants={riseIn}
              initial={reduce ? 'visible' : 'hidden'}
              animate="visible"
              className="md:col-span-5 md:col-start-8"
            >
              <p className="text-[14.5px] font-light leading-[2] text-white/60">
                <span className="text-white">THE CROWN VAULT</span> is luxury curation adapted for Pakistan —
                three pillars held to one uncompromising standard: perfumes as our primary focus, a considered
                handbag collection, and a refined selection of timepieces.
              </p>
              <p className="mt-6 text-[13.5px] font-light leading-[2] text-white/40">
                Every frame follows soft window photography, macro texture capture, and clean staging. From the
                stitch count in our totes to the bezel polish on our watches, we obsess over the small things.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link
                  to="/shop"
                  className="group relative inline-flex items-center gap-3 overflow-hidden border border-crown-gold/60 px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition-colors duration-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70"
                >
                  <span aria-hidden="true" className="absolute inset-0 -z-10 translate-y-full bg-crown-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  Enter the Vault
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link to="/categories/perfume" className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/45 underline-offset-8 transition hover:text-crown-gold hover:underline">
                  See ROOH →
                </Link>
              </div>
            </motion.div>

            {/* Small side note */}
            <motion.div
              variants={riseIn}
              initial={reduce ? 'visible' : 'hidden'}
              animate="visible"
              className="hidden md:col-span-2 md:col-start-1 md:block"
            >
              <div className="text-[9px] uppercase tracking-[0.42em] text-crown-gold">Index</div>
              <div className="mt-3 space-y-2 text-[11px] uppercase tracking-[0.28em] text-white/30">
                <div>I. Origin</div>
                <div>II. Craft</div>
                <div>III. Collection</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Full-bleed image break with editorial overlay */}
        <div className="relative mt-16 h-[62vw] min-h-[340px] max-h-[720px] w-full overflow-hidden md:mt-24">
          <ScrollParallax speed={0.12} offset={30} className="w-full h-full">
            <img
              src={`/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.51 PM (1).jpeg')}`}
              alt="ROOH Luxury Collection"
              className="h-full w-full object-cover object-center scale-110"
            />
          </ScrollParallax>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/40 pointer-events-none" />

          {/* Corner captions */}
          <div className="absolute left-5 top-5 sm:left-8 md:left-14 md:top-10 z-10">
            <div className="text-[9px] uppercase tracking-[0.42em] text-white/60">Fig. 01</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.3em] text-crown-gold">ROOH · NOIR</div>
          </div>

          <div className="absolute bottom-5 right-5 max-w-[280px] text-right sm:right-8 md:bottom-10 md:right-14 z-10">
            <p className="font-display text-[18px] leading-snug text-white md:text-[22px]">
              “If it doesn&apos;t hold up close, it doesn&apos;t make the vault.”
            </p>
            <div className="mt-2 text-[9px] uppercase tracking-[0.42em] text-white/40">— House Rule</div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE BAND ─────────────────────────────────────────────── */}
      <section className="relative border-y border-white/10 bg-[#0C0C0C]">
        <Marquee items={marquee} />
      </section>

      {/* ── STATS ROW ────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.value}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.75, ease: EASE_OUT }}
                className={`flex flex-col justify-between gap-8 py-10 md:py-14 ${i !== 0 ? 'md:border-l md:border-white/10 md:pl-8' : ''} ${i % 2 === 1 ? 'border-l border-white/10 pl-5 sm:pl-8' : ''} ${i < 2 ? 'border-b border-white/10 md:border-b-0' : ''}`}
              >
                <div className="text-[9px] uppercase tracking-[0.42em] text-crown-gold">0{i + 1}</div>
                <div>
                  <div className="font-display text-[34px] leading-none tracking-[-0.02em] text-white md:text-[52px]">
                    {s.value}
                  </div>
                  <div className="mt-3 text-[9px] uppercase tracking-[0.32em] text-white/35">
                    {s.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAPTERS (numbered editorial list) ───────────────────────── */}
      <section className="relative border-t border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 md:py-28 lg:px-14">
          <ScrollReveal direction="up" distance={24} duration={0.85}>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-crown-gold/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
                  The Chapters
                </span>
              </div>
              <p className="max-w-[420px] text-[13px] leading-[1.95] text-white/45">
                Four categories. One standard. Each entry is added to the vault only after it earns its place.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={28} duration={0.85} stagger={0.08} className="divide-y divide-white/10 border-y border-white/10">
            {chapters.map((c) => (
              <div key={c.n}>
                <Link
                  to={c.href}
                  className="group grid items-center gap-6 py-8 md:grid-cols-12 md:gap-10 md:py-10"
                >
                  {/* Number */}
                  <div className="md:col-span-1">
                    <span className="font-display text-[22px] text-white/30 transition-colors duration-500 group-hover:text-crown-gold md:text-[26px]">
                      {c.n}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="md:col-span-4">
                    <h3 className="font-display text-[clamp(2rem,4.2vw,3.25rem)] leading-none tracking-[-0.02em] text-white transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                      {c.title}
                    </h3>
                    <div className="mt-2 text-[9px] uppercase tracking-[0.42em] text-crown-gold">
                      {c.tag}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-5">
                    <p className="text-[13px] leading-[1.95] text-white/45 transition-colors duration-500 group-hover:text-white/70">
                      {c.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex md:col-span-2 md:justify-end">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/60 transition-all duration-500 group-hover:border-crown-gold group-hover:bg-crown-gold group-hover:text-black">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ── CLOSING BAND ─────────────────────────────────────────────── */}
      <section className="relative border-t border-white/10">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28 lg:px-14">
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: EASE_OUT }}
            className="md:col-span-7"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
              Ready when you are
            </div>
            <h3 className="mt-5 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.02em] text-white">
              Order on WhatsApp.
              <br />
              Pay <span className="italic font-light text-crown-gold">cash on delivery.</span>
            </h3>
            <p className="mt-6 max-w-[460px] text-[13.5px] leading-[2] text-white/45">
              Nationwide delivery across Pakistan. Talk to us directly, or browse the full vault online — whichever
              feels right.
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.1 }}
            className="flex flex-col justify-end gap-4 md:col-span-5"
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-between gap-4 overflow-hidden border border-crown-gold bg-crown-gold px-7 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-black transition-colors duration-500 hover:bg-transparent hover:text-crown-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70"
            >
              <span>Shop the Collection</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between gap-4 border border-white/15 px-7 py-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70 transition-colors duration-500 hover:border-white/40 hover:text-white"
            >
              <span>Order on WhatsApp</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOT STRIP ───────────────────────────────────────────────── */}
      <section className="relative border-t border-white/10 bg-[#0C0C0C]">
        <Marquee items={['CURATED', 'CRAFTED', 'DELIVERED', 'THE CROWN VAULT']} reverse />
      </section>
    </div>
  );
};