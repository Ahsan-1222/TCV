import { useState, useEffect } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Package, ShoppingBag, Users, TrendingUp, ShoppingCart, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export const AdminDashboard = () => {
  const [products] = useState<Product[]>(() => {
    try {
      const savedAdmin = localStorage.getItem('tcv_admin_products');
      if (savedAdmin) return JSON.parse(savedAdmin);
      const saved = localStorage.getItem('tcv_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialProducts;
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let received = false;
    let unsubscribe: (() => void) | null = null;

    const loadFromLocal = () => {
      try {
        const localOrders = localStorage.getItem('tcv_orders');
        if (localOrders) {
          const parsed = JSON.parse(localOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
            setLoadingOrders(false);
            return;
          }
        }
        const local = localStorage.getItem('tcv_last_order');
        setOrders(local ? [JSON.parse(local)] : []);
      } catch {
        setOrders([]);
      }
      setLoadingOrders(false);
    };

    try {
      const q = query(collection(db, 'orders'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        received = true;
        const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        ordersData.sort((a: any, b: any) => {
          const tA = a.createdAt?.seconds || (typeof a.createdAt === 'number' ? a.createdAt : 0);
          const tB = b.createdAt?.seconds || (typeof b.createdAt === 'number' ? b.createdAt : 0);
          return tB - tA;
        });
        setOrders(ordersData);
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
    }, 3000);

    return () => {
      unsubscribe?.();
      clearTimeout(fallback);
    };
  }, []);

  // Computed stats
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const completedOrders = orders.filter((o: any) => {
    const st = (o.status || 'pending').toLowerCase();
    return st === 'completed' || st === 'delivered';
  });
  const totalRevenue = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const uniqueCustomers = new Set(orders.map((o: any) => o.phone || o.email || o.name).filter(Boolean)).size;
  const pendingOrders = orders.filter(o => (o.status || 'pending').toLowerCase() === 'pending').length;

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, sub: `${products.filter(p => p.featured).length} featured` },
    { label: 'Stock Units', value: totalStock, icon: ShoppingBag, sub: 'Total in warehouse' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, sub: `${completedOrders.length} completed order${completedOrders.length === 1 ? '' : 's'}` },
    { label: 'Customers', value: uniqueCustomers || orders.length, icon: Users, sub: 'Unique buyers' },
  ];

  const statusColor = (status: string) => {
    const st = (status || 'pending').toLowerCase();
    if (st === 'completed' || st === 'delivered') return 'bg-green-100 text-green-800';
    if (st === 'cancelled' || st === 'refunded') return 'bg-red-100 text-red-800';
    if (st === 'processing' || st === 'shipped') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[28px] md:text-[32px] leading-none text-[#1A1A1A]">Dashboard</h1>
          <p className="text-[12px] text-gray-600 mt-2 uppercase tracking-widest">Live Analytics — The Crown Vault</p>
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
          <div key={c.label} className="bg-white border border-gray-200 p-4 md:p-6 hover:shadow-sm transition-shadow text-[#1A1A1A]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-gray-600 leading-tight">{c.label}</span>
              <c.icon size={15} className="text-gray-400 shrink-0" />
            </div>
            <div className="font-display text-xl md:text-2xl mt-3 md:mt-4 text-[#1A1A1A]">{c.value}</div>
            <div className="text-[10px] md:text-[11px] mt-1 md:mt-2 text-[#C9A86A] font-medium">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Content */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8 text-[#1A1A1A]">
        {/* Recent Products */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 text-[#1A1A1A]">
          <h3 className="font-display text-base md:text-lg mb-4 flex items-center gap-2 text-[#1A1A1A]">
            <Package size={16} className="text-gray-400" /> Recent Products
          </h3>
          <div className="space-y-3">
            {products.slice(0, 5).map(p => {
              const mainImage = p.images?.find((img: any) => img.isMain) || p.images?.[0];
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={mainImage?.url || 'https://via.placeholder.com/60'} className="w-9 h-11 object-cover bg-[#F8F6F3] border border-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium uppercase truncate text-[#1A1A1A]">{p.name}</div>
                    <div className="text-[11px] text-gray-500">{p.category} · Stock: {p.stock}</div>
                  </div>
                  <div className="text-[12px] font-semibold text-[#1A1A1A] shrink-0">{formatPrice(p.price)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 text-[#1A1A1A]">
          <h3 className="font-display text-base md:text-lg mb-4 flex items-center gap-2 text-[#1A1A1A]">
            <ShoppingCart size={16} className="text-gray-400" /> Recent Orders
          </h3>
          {loadingOrders ? (
            <div className="text-[12px] text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-[12px] text-gray-500 py-4">No orders yet.</div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, i) => (
                <div key={order.id || i} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[#1A1A1A] truncate">{order.name || 'Customer'}</div>
                    <div className="text-[11px] text-gray-500 truncate">{order.phone || order.email || `Order #${order.orderId || i + 1}`}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-widest font-medium ${statusColor(order.status || 'pending')}`}>
                      {order.status || 'pending'}
                    </span>
                    <span className="text-[12px] font-semibold text-[#1A1A1A]">{formatPrice(order.total || 0)}</span>
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
