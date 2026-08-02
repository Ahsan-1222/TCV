import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, pass);
    if (!ok) alert('Invalid credentials. Use crownvault / Admin@123');
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-white max-w-[400px] w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-white rounded-full p-1 overflow-hidden">
              <img src="/logo.jpg" alt="TCV Logo" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <h1 className="font-display text-2xl mt-4">Admin Dashboard</h1>
            <p className="text-[11px] uppercase tracking-widest opacity-60 mt-2">Secure Login — The Crown Vault</p>
            <p className="text-[11px] mt-4 bg-[#F8F6F3] p-3">Demo: crownvault<br/>Admin@123</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Username" className="w-full border px-4 py-3 text-[13px]" />
            <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full border px-4 py-3 text-[13px]" />
            <button className="w-full bg-black text-white py-3 text-[11px] tracking-widest uppercase">Login</button>
          </form>
          <Link to="/" className="block text-center mt-6 text-[11px] uppercase tracking-widest opacity-60 hover:opacity-100">← Back to Store</Link>
        </div>
      </div>
    );
  }

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex">
      <aside className="w-[260px] bg-[#0A0A0A] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-white flex items-center justify-center rounded-md overflow-hidden"><img src="/logo.jpg" alt="TCV" className="w-full h-full object-contain mix-blend-multiply" /></div><div><div className="font-display text-sm tracking-wide">THE CROWN VAULT</div><div className="text-[9px] tracking-widest uppercase opacity-50">Admin • Firebase Ready</div></div></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => {
            const active = loc.pathname === l.to;
            return <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-4 py-3 text-[12px] tracking-wide uppercase transition-colors ${active?'bg-white text-black':'hover:bg-white/10 text-white/70'}`}><l.icon size={16} />{l.label}</Link>;
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-[11px] opacity-60 mb-3 flex items-center gap-2"><Shield size={12}/> Secure • {user.email}</div>
          <button onClick={()=>{logout(); navigate('/');}} className="w-full flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white hover:text-black transition-colors text-[11px] tracking-widest uppercase"><LogOut size={14}/>Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-6 md:p-10"><Outlet /></div></main>
    </div>
  );
};
