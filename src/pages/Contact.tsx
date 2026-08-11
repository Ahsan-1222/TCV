import { useState } from 'react';
import { whatsappLink } from '../lib/utils';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

const faqs = [
  { q: 'COD Available?', a: 'Yes, Cash on Delivery is available across Pakistan. Nationwide delivery within 2–4 working days.' },
  { q: 'How long do the fragrances last?', a: 'All ROOH fragrances are EDP / Extrait concentration with 8–12 hour longevity, tested for Pakistan climate.' },
  { q: 'Online payment discount?', a: 'Pay via Easypaisa and receive an instant Rs. 100 discount on every order. Screenshot required.' },
  { q: 'Gift box available?', a: 'Yes, premium gift boxes available for all orders. Signature Trio bundle comes in a curated gift set.' },
];

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">

      {/* Hero header */}
      <div className="border-b border-white/5 bg-[#111111]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-3">Get in Touch</div>
            <h1 className="font-display text-[44px] sm:text-[60px] leading-[0.9] text-white">Contact Us.</h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Left: Info + Form */}
          <div>
            {/* Contact info */}
            <div className="space-y-5 mb-10">
              {[
                { icon: MessageCircle, label: 'WhatsApp Order', value: '+92 321 7244813 — Instant Reply' },
                { icon: Mail, label: 'Email', value: 'support@thecrownvault.pk' },
                { icon: MapPin, label: 'Location', value: 'Rawalpindi, Punjab — Nationwide Delivery' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 border-b border-white/6 pb-5">
                  <div className="w-9 h-9 border border-crown-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-crown-gold/70" />
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.28em] uppercase text-white/30 mb-1">{label}</div>
                    <div className="text-[13px] text-white/70">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={e => {
                e.preventDefault();
                window.open(whatsappLink(`Hello! Name: ${form.name}, Email: ${form.email}, Message: ${form.message}`), '_blank');
              }}
              className="space-y-3"
            >
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#111111] border border-white/10 px-4 py-3.5 text-[13px] text-white placeholder-white/25 outline-none focus:border-crown-gold/50 transition-colors"
              />
              <input
                required
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-[#111111] border border-white/10 px-4 py-3.5 text-[13px] text-white placeholder-white/25 outline-none focus:border-crown-gold/50 transition-colors"
              />
              <textarea
                required
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#111111] border border-white/10 px-4 py-3.5 text-[13px] text-white placeholder-white/25 outline-none focus:border-crown-gold/50 transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full bg-crown-gold text-[#0A0A0A] py-4 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
              >
                Send via WhatsApp
              </button>
            </form>
          </div>

          {/* Right: FAQ */}
          <div>
            <div className="text-[9px] tracking-[0.4em] uppercase text-crown-gold mb-6">FAQ</div>
            <h2 className="font-display text-[28px] sm:text-[36px] text-white mb-8 leading-none">
              Frequently Asked<br />
              <span className="italic font-light text-crown-gold">Questions.</span>
            </h2>
            <div className="space-y-1">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-white/8 bg-[#111111]">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-[13px] text-white/75 font-medium pr-4">{faq.q}</span>
                    <span className={`text-crown-gold text-[18px] leading-none transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-[12px] leading-[1.8] text-white/40 border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/923217244813"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-3 border border-[#25D366]/30 text-[#25D366] px-6 py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-[#25D366]/10 transition-colors w-fit"
            >
              <MessageCircle size={16} />
              Chat on WhatsApp Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
