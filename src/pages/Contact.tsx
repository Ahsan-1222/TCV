import { useState } from 'react';
import { whatsappLink } from '../lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, Mail, MapPin, ArrowUpRight, Plus } from 'lucide-react';

/* ─────────────────────────────  DATA  ───────────────────────────── */

const contactChannels = [
  {
    icon: MessageCircle,
    label: 'WhatsApp · Instant',
    value: '+92 321 7244813',
    href: 'https://wa.me/923217244813',
    hint: 'Fastest reply · 10am – 10pm PKT',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@thecrownvault.pk',
    href: 'mailto:hello@thecrownvault.pk',
    hint: 'Order enquiries · Wholesale',
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: 'Rawalpindi, Punjab',
    hint: 'Nationwide delivery · 2–4 working days',
  },
];

const faqs = [
  { q: 'COD Available?', a: 'Yes, Cash on Delivery is available across Pakistan. Nationwide delivery within 2–4 working days.' },
  { q: 'How long do the fragrances last?', a: 'All ROOH fragrances are EDP / Extrait concentration with 8–12 hour longevity, tested for Pakistan climate.' },
  { q: 'Online payment discount?', a: 'Pay via Easypaisa and receive an instant Rs. 100 discount on every order. Screenshot required.' },
  { q: 'Gift box available?', a: 'Yes, premium gift boxes available for all orders. Signature Trio bundle comes in a curated gift set.' },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ────────────────────────────  COMPONENT  ──────────────────────────── */

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      whatsappLink(`Hello! Name: ${form.name}, Email: ${form.email}, Message: ${form.message}`),
      '_blank',
    );
  };

  return (
    <div className="relative min-h-screen bg-[#080808] text-white antialiased">
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-[1560px] px-5 pt-16 sm:px-8 md:pt-24 lg:px-14">
          {/* Meta row */}
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="flex items-center justify-between gap-6 border-b border-white/10 pb-6"
          >
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-crown-gold" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.42em] text-white/55">
                The Crown Vault · Contact
              </span>
            </div>
            <span className="hidden text-[9px] uppercase tracking-[0.42em] text-white/30 sm:block">
              Replies within the hour
            </span>
          </motion.div>

          {/* Display headline + intro */}
          <div className="grid gap-10 pt-10 md:grid-cols-12 md:gap-12 md:pt-14">
            <div className="md:col-span-8">
              <motion.h1
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
                className="font-display text-[clamp(2.75rem,10vw,7rem)] font-normal leading-[0.88] tracking-[-0.035em] text-white"
              >
                Let&apos;s
                <span className="ml-[0.15em] italic font-light text-crown-gold">talk.</span>
              </motion.h1>
            </div>

            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
              className="self-end md:col-span-4"
            >
              <p className="max-w-[380px] text-[13.5px] font-light leading-[2] text-white/50">
                A question about a scent, a watch, or an order already on its way — reach us directly on WhatsApp
                or drop a note. We answer every message ourselves.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1560px] px-5 py-16 sm:px-8 md:py-24 lg:px-14">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-24">

          {/* ── LEFT: CHANNELS + FORM ─────────────────────────────── */}
          <div>
            {/* Channels */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE_OUT }}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-crown-gold/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
                  Direct Lines
                </span>
              </div>

              <ul className="divide-y divide-white/10 border-y border-white/10">
                {contactChannels.map(({ icon: Icon, label, value, href, hint }) => {
                  const inner = (
                    <div className="group flex items-start gap-5 py-6">
                      <div className="grid h-11 w-11 shrink-0 place-items-center border border-crown-gold/30 text-crown-gold transition-colors duration-500 group-hover:border-crown-gold group-hover:bg-crown-gold/[0.08]">
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.36em] text-white/35">
                          {label}
                        </div>
                        <div className="mt-1.5 truncate font-display text-[19px] leading-tight text-white md:text-[22px]">
                          {value}
                        </div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/30">
                          {hint}
                        </div>
                      </div>
                      {href && (
                        <ArrowUpRight className="mt-2 h-4 w-4 shrink-0 text-white/25 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-crown-gold" />
                      )}
                    </div>
                  );

                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: EASE_OUT }}
              className="mt-14"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-crown-gold/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
                  Send a Note
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.32em] text-white/40">
                      Your Name <span className="text-crown-gold">*</span>
                    </label>
                    <input
                      required
                      placeholder="e.g. Hammad Khan"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-white/12 bg-[#0E0E0E] px-4 py-3.5 text-[13px] text-white placeholder-white/20 outline-none transition-colors focus:border-crown-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.32em] text-white/40">
                      Email <span className="text-crown-gold">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-white/12 bg-[#0E0E0E] px-4 py-3.5 text-[13px] text-white placeholder-white/20 outline-none transition-colors focus:border-crown-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.32em] text-white/40">
                    Your Message <span className="text-crown-gold">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you're looking for — a scent, a specific piece, or an order enquiry..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none border border-white/12 bg-[#0E0E0E] px-4 py-3.5 text-[13px] leading-relaxed text-white placeholder-white/20 outline-none transition-colors focus:border-crown-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden border border-crown-gold bg-crown-gold px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-black transition-colors duration-500 hover:bg-transparent hover:text-crown-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crown-gold/70"
                >
                  <MessageCircle size={15} className="relative z-10" />
                  <span className="relative z-10">Send via WhatsApp</span>
                  <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <p className="pt-1 text-center text-[10px] uppercase tracking-[0.28em] text-white/30">
                  Opens WhatsApp with your message pre-filled
                </p>
              </form>
            </motion.div>
          </div>

          {/* ── RIGHT: FAQ ────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, ease: EASE_OUT }}
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-crown-gold/70" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-crown-gold">
                  Before You Ask
                </span>
              </div>

              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-normal leading-[1.02] tracking-[-0.02em] text-white">
                Frequently asked,
                <br />
                <span className="italic font-light text-crown-gold">quickly answered.</span>
              </h2>

              <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {faqs.map((faq, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : i)}
                        aria-expanded={open}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors"
                      >
                        <div className="flex min-w-0 items-baseline gap-5">
                          <span className="font-display text-[13px] tabular-nums text-white/25">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-[14.5px] font-medium leading-snug transition-colors duration-300 md:text-[15.5px] ${
                              open ? 'text-crown-gold' : 'text-white/80 group-hover:text-white'
                            }`}
                          >
                            {faq.q}
                          </span>
                        </div>
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                            open
                              ? 'rotate-45 border-crown-gold bg-crown-gold text-black'
                              : 'border-white/20 text-white/60 group-hover:border-white/40 group-hover:text-white'
                          }`}
                        >
                          <Plus size={14} strokeWidth={1.75} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE_OUT }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 pl-11 pr-10 text-[13.5px] font-light leading-[1.95] text-white/50">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/923217244813"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 flex items-center justify-between gap-4 border border-[#25D366]/40 px-6 py-5 text-[#25D366] transition-colors duration-500 hover:border-[#25D366] hover:bg-[#25D366]/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-[#25D366]/40">
                    <MessageCircle size={16} />
                  </span>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                      Chat on WhatsApp
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-[#25D366]/60">
                      +92 321 7244813 · Instant reply
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOT STRIP ───────────────────────────────────────────────── */}
      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8 lg:px-14">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/35">
            <span className="h-px w-8 bg-crown-gold/60" />
            Rawalpindi · Nationwide Delivery · COD Available
          </div>
          <span className="text-[10px] uppercase tracking-[0.32em] text-white/30">
            Est. 2026 · Pakistan
          </span>
        </div>
      </section>
    </div>
  );
};