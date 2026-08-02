import { useState } from 'react';
import { whatsappLink } from '../lib/utils';

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-16 grid lg:grid-cols-2 gap-16">
      <div>
        <div className="text-crown-gold text-[11px] tracking-[0.3em] uppercase mb-4">Get in Touch</div>
        <h1 className="font-display text-[40px] leading-none">Contact Us</h1>
        <div className="mt-8 space-y-6 text-[13px] leading-6">
          <div><div className="uppercase tracking-widest text-[11px] opacity-50">WhatsApp Order</div><div className="font-medium mt-1">+92 321 7244813 — Instant Reply</div></div>
          <div><div className="uppercase tracking-widest text-[11px] opacity-50">Email</div><div className="font-medium mt-1">support@thecrownvault.pk</div></div>
          <div><div className="uppercase tracking-widest text-[11px] opacity-50">Location</div><div className="font-medium mt-1">Rawalpindi, Punjab, Pakistan — Nationwide Delivery</div></div>
        </div>

        <form onSubmit={e => { e.preventDefault(); window.open(whatsappLink(`Hello! Name: ${form.name}, Email: ${form.email}, Message: ${form.message}`), '_blank'); }} className="mt-10 space-y-4 max-w-[480px]">
          <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border px-4 py-3 text-[13px] outline-none focus:border-black" />
          <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border px-4 py-3 text-[13px] outline-none focus:border-black" />
          <textarea required placeholder="Message" rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="w-full border px-4 py-3 text-[13px] outline-none focus:border-black" />
          <button className="w-full bg-black text-white py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-crown-gold transition-colors">Send via WhatsApp</button>
        </form>
      </div>
      <div className="bg-[#F8F6F3] p-8">
        <h3 className="font-display text-xl mb-6">FAQ</h3>
        <div className="space-y-6 text-[13px] leading-6">
          <div><div className="font-medium">COD Available?</div><div className="opacity-60 mt-1">Yes, Cash on Delivery is available across Pakistan. Nationwide delivery within 2-4 days.</div></div>
          <div><div className="font-medium">Long-lasting projection?</div><div className="opacity-60 mt-1">All ROOH fragrances are EDP / Extrait with 8-12 hour longevity, tested for Pakistan climate.</div></div>
          <div><div className="font-medium">Gift box integration with watch?</div><div className="opacity-60 mt-1">Yes, we offer premium gift boxes that integrate perfume with timepiece collection for weddings.</div></div>
        </div>
      </div>
    </div>
  );
};
