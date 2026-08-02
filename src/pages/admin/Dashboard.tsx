import { useState, useEffect } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Package, ShoppingBag, Users, TrendingUp, ShoppingCart, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const AdminDashboard = () => {
  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tcv_admin_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let received = false;
    let unsubscribe: (() => void) | null = null;

    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        received = true;
        setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoadingOrders(false);
      }, () => {
        received = true;
        loadFromLocal();
      });
    } catch {
      loadFromLocal();
    }

    const fallback = setTimeout(() => {
      if (!received) loadFromLocal();
    }, 4000);

    return () => {
      unsubscribe?.();
      clearTimeout(fallback);
    };
  }, []);

  const loadFromLocal = () => {
    const local = localStorage.getItem('tcv_last_order');
    setOrders(local ? [JSON.parse(local)] : []);
    setLoadingOrders(false);
  };

  // Computed stats
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const uniqueCustomers = new Set(orders.map((o: any) => o.phone || o.email || o.name).filter(Boolean)).size;
  const pendingOrders = orders.filter(o => (o.status || 'pending') === 'pending').length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, sub: `${products.filter(p => p.featured).length} featured` },
    { label: 'Stock Units', value: totalStock, icon: ShoppingBag, sub: 'Total in warehouse' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, sub: `${orders.length} orders` },
    { label: 'Customers', value: uniqueCustomers || orders.length, icon: Users, sub: 'Unique buyers' },
  ];

  const statusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'cancelled') return 'bg-red-100 text-red-800';
    if (status === 'processing' || status === 'shipped') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[28px] md:text-[32px] leading-none">Dashboard</h1>
          <p className="text-[12px] opacity-60 mt-2 uppercase tracking-widest">Live Analytics — The Crown Vault</p>
        </div>
        {pendingOrders > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 px-4 py-2 text-[12px] text-yellow-800">
            <Clock size={14} /> {pendingOrders} pending order{pendingOrders > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6 md:mt-8">
        {stats.map(c => (
          <div key={c.label} className="bg-white border p-4 md:p-6 hover:shadow-sm transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-[10px] md:text-[11px] uppercase tracking-widest opacity-60 leading-tight">{c.label}</span>
              <c.icon size={15} className="opacity-30 shrink-0" />
            </div>
            <div className="font-display text-xl md:text-2xl mt-3 md:mt-4">{c.value}</div>
            <div className="text-[10px] md:text-[11px] mt-1 md:mt-2 text-crown-gold">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Content */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
        {/* Recent Products */}
        <div className="bg-white border p-4 md:p-6">
          <h3 className="font-display text-base md:text-lg mb-4 flex items-center gap-2">
            <Package size={16} className="opacity-40" /> Recent Products
          </h3>
          <div className="space-y-3">
            {products.slice(0, 5).map(p => {
              const mainImage = p.images?.find((img: any) => img.isMain) || p.images?.[0];
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={mainImage?.url || 'https://via.placeholder.com/60'} className="w-9 h-11 object-cover bg-[#F8F6F3] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium uppercase truncate">{p.name}</div>
                    <div className="text-[11px] opacity-50">{p.category} · Stock: {p.stock}</div>
                  </div>
                  <div className="text-[12px] font-semibold shrink-0">{formatPrice(p.price)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border p-4 md:p-6">
          <h3 className="font-display text-base md:text-lg mb-4 flex items-center gap-2">
            <ShoppingCart size={16} className="opacity-40" /> Recent Orders
          </h3>
          {loadingOrders ? (
            <div className="text-[12px] opacity-50">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-[12px] opacity-50 py-4">No orders yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, i) => (
                <div key={order.id || i} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium truncate">{order.name || 'Customer'}</div>
                    <div className="text-[11px] opacity-50 truncate">{order.phone || order.email || `Order #${order.orderId || i + 1}`}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest font-medium ${statusColor(order.status || 'pending')}`}>
                      {order.status || 'pending'}
                    </span>
                    <span className="text-[12px] font-semibold">{formatPrice(order.total || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
