import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { AnnouncementBar } from './AnnouncementBar';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, setIsOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Perfumes', to: '/categories/perfume' },
    { label: 'Bags', to: '/categories/bags' },
    { label: 'Jewellery', to: '/categories/jewellery' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-[#0A0A0A] border-b border-white/5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[60px] sm:h-[68px] md:h-[76px]">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 -ml-1 text-white/90 hover:text-white transition-colors flex-shrink-0"
                aria-label="Menu"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                  <img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain [filter:brightness(0)_saturate(100%)_invert(75%)_sepia(34%)_saturate(660%)_hue-rotate(357deg)_brightness(92%)_contrast(85%)]" />
                </div>
                <div className="block min-w-0 overflow-hidden">
                  <div className="font-display text-[11px] sm:text-[14px] md:text-[17px] leading-none tracking-[0.08em] sm:tracking-[0.12em] font-semibold text-white truncate">
                    THE CROWN VAULT
                  </div>
                  <div className="text-[6px] sm:text-[7px] tracking-[0.2em] sm:tracking-[0.38em] uppercase text-crown-gold mt-0.5 truncate">
                    Luxury Curations
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[11px] tracking-[0.18em] font-medium text-white/80 hover:text-white transition-colors relative group uppercase"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-crown-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} className="sm:w-[19px] sm:h-[19px]" strokeWidth={1.5} />
              </button>
              <Link
                to="/wishlist"
                className="p-2 sm:p-2.5 text-white/80 hover:text-white transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart size={18} className="sm:w-[19px] sm:h-[19px]" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 sm:-top-0.5 sm:-right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-crown-gold text-[#0A0A0A] text-[8px] sm:text-[9px] flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 sm:p-2.5 text-white/80 hover:text-white transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} className="sm:w-[19px] sm:h-[19px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 sm:-top-0.5 sm:-right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-crown-gold text-[#0A0A0A] text-[8px] sm:text-[9px] flex items-center justify-center rounded-full font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/8"
              >
                <form onSubmit={handleSearch} className="py-3 flex gap-2">
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search perfumes, bags, jewellery..."
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[13px] text-white placeholder-white/40 outline-none focus:border-crown-gold/50 transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-crown-gold text-[#0A0A0A] px-6 text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-crown-gold-dark transition-colors"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Full-Screen Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-0 bg-[#0A0A0A] z-[80] flex flex-col h-full overflow-y-auto"
            >
              {/* Close button header */}
              <div className="flex items-center justify-between px-4 sm:px-6 h-[60px] sm:h-[64px] border-b border-white/10 flex-shrink-0 sticky top-0 bg-[#0A0A0A] z-10">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                  <img src="/logo.jpg" alt="TCV" className="w-9 h-9 sm:w-10 sm:h-10 object-contain [filter:brightness(0)_saturate(100%)_invert(75%)_sepia(34%)_saturate(660%)_hue-rotate(357deg)_brightness(92%)_contrast(85%)]" />
                  <div className="flex flex-col">
                    <span className="font-display text-[13px] sm:text-[15px] tracking-[0.1em] text-white font-semibold leading-none">THE CROWN VAULT</span>
                    <span className="text-[6px] tracking-[0.3em] uppercase text-crown-gold mt-0.5">Luxury Curations</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 py-6 px-6 sm:px-8 flex flex-col justify-center gap-1 sm:gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between py-3 border-b border-white/5 hover:border-crown-gold/40 transition-colors"
                    >
                      <span className="font-display text-[22px] sm:text-[26px] leading-[1.3] text-white font-medium group-hover:text-crown-gold transition-colors duration-300">
                        {link.label}
                      </span>
                      <span className="text-[10px] tracking-[0.2em] text-crown-gold opacity-0 group-hover:opacity-100 transition-opacity">
                        EXPLORE →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom info */}
              <div className="px-6 sm:px-8 pb-8 pt-4 flex-shrink-0 space-y-1.5 border-t border-white/10 bg-[#070707]">
                <p className="text-[11px] tracking-[0.15em] uppercase text-white/90 font-mono">WhatsApp: +92 321 7244813</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">COD · Nationwide Delivery</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
