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
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'SHOP', to: '/shop' },
    { label: 'PERFUMES', to: '/categories/perfume' },
    { label: 'BAGS', to: '/categories/bags' },
    { label: 'JEWELLERY', to: '/categories/jewellery' },
    { label: 'ABOUT', to: '/about' },
    { label: 'CONTACT', to: '/contact' },
  ];

  return (
    <>
      <AnnouncementBar />
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/60 backdrop-blur-lg shadow-sm border-b border-white/20' : 'bg-[#FAF9F6] border-b border-black/5'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[72px] md:h-[84px]">
            {/* Left side: Hamburger & Logo */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2">
                {mobileOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <img src="/logo.jpg" alt="TCV Logo" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="hidden md:block">
                  <h1 className="font-display text-[18px] leading-none tracking-[0.14em] font-semibold">THE CROWN VAULT</h1>
                  <p className="text-[8px] tracking-[0.32em] uppercase opacity-60 -mt-0.5">Luxury Curations</p>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} className="text-[11px] tracking-[0.2em] font-medium hover:text-crown-gold transition-colors relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-crown-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 hover:bg-neutral-50 rounded-full transition-colors">
                <Search size={20} strokeWidth={1} />
              </button>
              <Link to="/wishlist" className="p-2.5 hover:bg-neutral-50 rounded-full transition-colors relative">
                <Heart size={20} strokeWidth={1} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-crown-gold text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsOpen(true)} className="p-2.5 hover:bg-neutral-50 rounded-full transition-colors relative">
                <ShoppingBag size={20} strokeWidth={1} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-neutral-100">
                <form onSubmit={handleSearch} className="py-4 flex gap-3">
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search perfumes, bags, jewellery..." className="flex-1 bg-neutral-50 px-5 py-3 text-sm outline-none focus:ring-1 focus:ring-crown-gold/30 border border-transparent focus:border-crown-gold/20 rounded-none" autoFocus />
                  <button type="submit" className="bg-black text-white px-8 text-[11px] tracking-[0.2em] uppercase">Search</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 24 }} className="lg:hidden absolute top-full left-0 right-0 h-[calc(100vh-72px)] md:h-[calc(100vh-84px)] bg-white z-50 p-8 border-t border-neutral-100">
              <nav className="flex flex-col gap-6">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-[15px] tracking-[0.18em] font-medium border-b border-neutral-100 pb-4">
                    {link.label}
                  </Link>
                ))}
                <div className="mt-8 space-y-4 text-sm opacity-60">
                  <p>COD Available</p>
                  <p>WhatsApp Order: +92 321 7244813</p>
                  <p>Nationwide Delivery</p>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
