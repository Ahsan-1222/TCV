import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Shield, Image, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [pass, setPass] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(pass);
    if (ok) {
      navigate('/admin');
    } else {
      alert('Invalid password. Please try again.');
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 text-[#1A1A1A]">
        <div className="bg-white max-w-[400px] w-full p-8 rounded-sm shadow-xl text-[#1A1A1A]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full p-1 overflow-hidden border border-gray-200">
              <img src="/logo.jpg" alt="TCV Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h1 className="font-display text-2xl mt-4 text-[#1A1A1A]">Admin Dashboard</h1>
            <p className="text-[11px] uppercase tracking-widest text-gray-500 mt-2">Secure Login — The Crown Vault</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-gray-600 mb-2">Password</label>
              <input
                value={pass}
                onChange={e => setPass(e.target.value)}
                type="password"
                placeholder="Enter admin password"
                className="w-full border border-gray-300 bg-white px-4 py-3 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-black"
                autoFocus
              />
            </div>
            <button className="w-full bg-black text-white py-3 text-[11px] tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Login
            </button>
          </form>
          <Link to="/" className="block text-center mt-6 text-[11px] uppercase tracking-widest text-gray-500 hover:text-black">← Back to Store</Link>
        </div>
      </div>
    );
  }

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/banners', label: 'Banners', icon: Image },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const Sidebar = () => (
    <aside className="w-[240px] bg-[#0A0A0A] text-white flex flex-col h-full">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white flex items-center justify-center rounded-md overflow-hidden shrink-0">
            <img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <div>
            <div className="font-display text-sm tracking-wide text-white">THE CROWN VAULT</div>
            <div className="text-[9px] tracking-widest uppercase text-white/50">Admin Panel</div>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(l => {
          const active = loc.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-[12px] tracking-wide uppercase transition-colors rounded-sm ${active ? 'bg-white text-black font-semibold' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
            >
              <l.icon size={15} />{l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] text-white/50 mb-3 flex items-center gap-2"><Shield size={11} /> Secure Admin Session</div>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white hover:text-black transition-colors text-[11px] tracking-widest uppercase text-white"
        >
          <LogOut size={13} />Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#1A1A1A] flex relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-[240px] shrink-0 min-h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-[240px] h-full flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto text-[#1A1A1A]">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 bg-[#0A0A0A] text-white px-4 py-3 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="text-white/80 hover:text-white">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="TCV" className="w-7 h-7 object-contain mix-blend-multiply bg-white rounded p-0.5" />
            <span className="font-display text-sm tracking-wide text-white">THE CROWN VAULT</span>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-10 text-[#1A1A1A]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
