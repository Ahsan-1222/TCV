import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-white mt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 w-fit">
              <div className="w-24 h-24 backdrop-blur-lg p-2.5 flex items-center justify-center rounded-full shadow-2xl mix-blend-screen">
                <img src="/logo.jpg" alt="TCV Logo" className="w-18 h-18 object-contain mix-blend-multiply opacity-100" />
              </div>
            </Link>
            <p className="text-[13px] leading-6 text-white/60 max-w-xs font-light">
              Luxury curations adapted for Pakistan. Perfumes as primary focus, with handbags and jewellery crafted for timeless elegance.
            </p>
            <div className="flex gap-6 mt-8 text-[11px] tracking-widest uppercase text-white/40">
              <span>COD Available</span>
              <span>•</span>
              <span>WhatsApp Order</span>
              <span>•</span>
              <span>Nationwide</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-6 opacity-60">Shop</h4>
            <ul className="space-y-3 text-[13px] text-white/80">
              <li><Link to="/shop" className="hover:text-crown-gold transition-colors">All Products</Link></li>
              <li><Link to="/categories/perfume" className="hover:text-crown-gold transition-colors">Perfumes</Link></li>
              <li><Link to="/categories/bags" className="hover:text-crown-gold transition-colors">Ladies Bags</Link></li>
              <li><Link to="/categories/jewellery" className="hover:text-crown-gold transition-colors">Jewellery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-6 opacity-60">Info</h4>
            <ul className="space-y-3 text-[13px] text-white/80">
              <li><Link to="/about" className="hover:text-crown-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-crown-gold transition-colors">Contact</Link></li>
              <li><Link to="/shop" className="hover:text-crown-gold transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/about" className="hover:text-crown-gold transition-colors">Care Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase mb-6 opacity-60">Contact</h4>
            <ul className="space-y-3 text-[13px] text-white/60">
              <li>WhatsApp: +92 321 7244813</li>
              <li>support@thecrownvault.pk</li>
              <li>Rawalpindi, Punjab, PK</li>
              <li className="pt-2">
                <a href="https://wa.me/923217244813" target="_blank" rel="noopener noreferrer" className="inline-flex bg-white text-black px-5 py-2.5 text-[11px] tracking-widest uppercase hover:bg-crown-gold hover:text-white transition-colors">Chat on WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-widest uppercase text-white/40">
          <p>© 2026 THE CROWN VAULT. Luxury Curations - Pakistan Market Adaptation.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span className="text-crown-gold">COD Available Across Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
