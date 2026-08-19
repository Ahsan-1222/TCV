import { Link } from 'react-router-dom';

export const Footer = () => {
  const shopLinks = [
    { label: 'All Products', to: '/shop' },
    { label: 'Perfumes', to: '/categories/perfume' },
    { label: 'Ladies Bags', to: '/categories/bags' },
    { label: 'Jewellery', to: '/categories/jewellery' },
  ];
  const infoLinks = [
    { label: 'Our Story', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Shipping & Returns', to: '/shop' },
    { label: 'Care Guide', to: '/about' },
  ];

  return (
    <footer className="bg-[#080808] border-t border-white/5">
      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
              <div className="w-11 h-11">
                <img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain [filter:brightness(0)_saturate(100%)_invert(75%)_sepia(34%)_saturate(660%)_hue-rotate(357deg)_brightness(92%)_contrast(85%)] opacity-95" />
              </div>
              <div>
                <div className="font-display text-[13px] tracking-[0.14em] text-white/80">THE CROWN VAULT</div>
                <div className="text-[7px] tracking-[0.35em] uppercase text-crown-gold mt-0.5">Luxury Curations</div>
              </div>
            </Link>
            <p className="text-[12px] leading-[1.8] text-white/35 max-w-[240px] font-light">
              Luxury curations adapted for Pakistan. Perfumes, handbags & jewellery crafted for timeless elegance.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5 text-[9px] tracking-[0.22em] uppercase text-white/25">
              <span>COD</span>
              <span className="text-white/10">·</span>
              <span>WhatsApp</span>
              <span className="text-white/10">·</span>
              <span>Nationwide</span>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-crown-gold mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[12px] text-white/45 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-crown-gold mb-5">Info</h4>
            <ul className="space-y-3">
              {infoLinks.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[12px] text-white/45 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-crown-gold mb-5">Contact</h4>
            <ul className="space-y-3 text-[12px] text-white/35">
              <li>+92 321 7244813</li>
              <li>tcv.vault@gmail.com</li>
              <li>Rawalpindi, Punjab, PK</li>
            </ul>
            <a
              href="https://wa.me/923217244813"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex bg-crown-gold text-[#0A0A0A] px-5 py-2.5 text-[9px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] tracking-[0.2em] uppercase text-white/20">
          <p>© 2026 The Crown Vault · Pakistan</p>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span className="text-crown-gold/50">COD Available Across Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
