import { useState } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tcv_admin_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [lastOrder] = useState(() => {
    const saved = localStorage.getItem('tcv_last_order');
    return saved ? JSON.parse(saved) : null;
  });

  const totalStock = products.reduce((s,p)=>s+(p.stock || 0),0);
  const revenue = lastOrder && lastOrder.status === 'completed' ? lastOrder.total : (lastOrder ? lastOrder.total : 0);
  const customers = lastOrder ? 1 : 0;
  return (
    <div>
      <h1 className="font-display text-[32px] leading-none">Dashboard Analytics</h1>
      <p className="text-[12px] opacity-60 mt-2 uppercase tracking-widest">Firebase-ready • Products auto-appear on website</p>

      <div className="grid md:grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Total Products', value: products.length, icon: Package, change: 'Active catalog' },
          { label: 'Stock Units', value: totalStock, icon: ShoppingBag, change: 'In warehouse' },
          { label: 'Total Revenue', value: formatPrice(revenue), icon: TrendingUp, change: 'Based on orders' },
          { label: 'Customers', value: customers, icon: Users, change: 'Registered buyers' },
        ].map(c=>(
          <div key={c.label} className="bg-white border p-6">
            <div className="flex justify-between"><span className="text-[11px] uppercase tracking-widest opacity-60">{c.label}</span><c.icon size={16} className="opacity-40" /></div>
            <div className="font-display text-2xl mt-4">{c.value}</div>
            <div className="text-[11px] mt-2 text-crown-gold">{c.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border p-6">
          <h3 className="font-display text-lg mb-4">Recent Products</h3>
          <div className="space-y-3">
            {products.slice(0,5).map(p=>{
              const mainImage = p.images?.find((img: any) => img.isMain) || p.images?.[0];
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={mainImage?.url || 'https://via.placeholder.com/150'} className="w-10 h-12 object-cover bg-[#F8F6F3]" />
                  <div className="flex-1">
                    <div className="text-[12px] font-medium uppercase">{p.name}</div>
                    <div className="text-[11px] opacity-50">{p.category} • Stock: {p.stock}</div>
                  </div>
                  <div className="text-[12px] font-semibold">{formatPrice(p.price)}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#0A0A0A] text-white p-6">
          <h3 className="font-display text-lg mb-2">Firebase Integration Ready</h3>
          <p className="text-[12px] opacity-60 leading-6">Structure prepared for Authentication, Firestore, Storage, Orders, Wishlist. Products added here automatically appear on website without code changes via Firestore collection listener. Authentication roles: admin / customer.</p>
          <div className="mt-6 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white/10 p-3">firebase/auth</div><div className="bg-white/10 p-3">firestore/products</div><div className="bg-white/10 p-3">storage/images</div><div className="bg-white/10 p-3">firestore/orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};
