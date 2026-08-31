import { Link } from 'react-router-dom';

export const Footer = () => {
  const shopLinks = [
    { label: 'All Products', to: '/shop' },
    { label: 'Perfumes', to: '/categories/perfume' },
    { label: 'Ladies Bags', to: '/categories/bags' },
    { label: 'Watches', to: '/categories/watches' },
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
              Luxury curations adapted for Pakistan. Perfumes, handbags & watches crafted for timeless elegance.
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
            <h4 className="text-[9px] tracking-[0.3em] uppercase text-crown-gold mb-5">Contact & Socials</h4>
            <ul className="space-y-3 text-[12px] text-white/35">
              <li>+92 321 7244813</li>
              <li>tcv.vault@gmail.com</li>
              <li>Rawalpindi, Punjab, PK</li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://www.instagram.com/tcv1213?igsi=MXJiNm5hYmp0cjdpdQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:text-crown-gold hover:border-crown-gold transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@tcv12131?_r=1&_t=ZS-99IJ9IBPM1M"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:text-crown-gold hover:border-crown-gold transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.35a6.32 6.32 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 10.83 4.47 6.3 6.3 0 0 0 1.87-4.47V8.62a8.23 8.23 0 0 0 4.75 1.5V6.69z"/>
                </svg>
              </a>
            </div>
            <a
              href="https://wa.me/923217244813"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex bg-crown-gold text-[#0A0A0A] px-5 py-2.5 text-[9px] tracking-[0.25em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
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
