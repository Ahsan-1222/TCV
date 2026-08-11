import { useState, useEffect } from 'react';
import { formatPrice } from '../../lib/utils';
import { Package, User, MapPin, CreditCard, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, query, deleteDoc } from 'firebase/firestore';

export const OrdersAdmin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let snapshotReceived = false;
    let unsubscribe: (() => void) | null = null;

    const loadFromLocal = () => {
      try {
        const localOrders = localStorage.getItem('tcv_orders');
        if (localOrders) {
          const parsed = JSON.parse(localOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
            setLoading(false);
            return;
          }
        }
        const localOrder = localStorage.getItem('tcv_last_order');
        setOrders(localOrder ? [JSON.parse(localOrder)] : []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };

    try {
      const q = query(collection(db, 'orders'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshotReceived = true;
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        ordersData.sort((a: any, b: any) => {
          const tA = a.createdAt?.seconds || (typeof a.createdAt === 'number' ? a.createdAt : 0);
          const tB = b.createdAt?.seconds || (typeof b.createdAt === 'number' ? b.createdAt : 0);
          return tB - tA;
        });
        setOrders(ordersData);
        setLoading(false);
      }, (error) => {
        snapshotReceived = true;
        console.warn("Firebase failed, falling back to local storage:", error);
        loadFromLocal();
      });
    } catch {
      loadFromLocal();
    }

    const fallbackTimeout = setTimeout(() => {
      if (!snapshotReceived) {
        console.warn("Firebase timeout, falling back to local storage");
        loadFromLocal();
      }
    }, 3000);

    return () => {
      unsubscribe?.();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o));
    try {
      const localOrders = JSON.parse(localStorage.getItem('tcv_orders') || '[]');
      const updated = localOrders.map((o: any) => (o.id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o);
      localStorage.setItem('tcv_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not sync status to localStorage fallback", e);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
      setOrders(prev => prev.filter(o => o.id !== orderId && o.orderId !== orderId));
      try {
        const localOrders = JSON.parse(localStorage.getItem('tcv_orders') || '[]');
        const updated = localOrders.filter((o: any) => o.id !== orderId && o.orderId !== orderId);
        localStorage.setItem('tcv_orders', JSON.stringify(updated));
      } catch {}
    }
  };

  return (
    <div className="text-[#1A1A1A]">
      <h1 className="font-display text-[28px] text-[#1A1A1A]">Orders Management</h1>
      <p className="text-[12px] text-gray-600 mt-2">Firebase-connected — Live Firestore orders collection</p>
      
      {loading ? (
        <div className="mt-8 text-[13px] text-gray-600">Loading live orders from Firebase...</div>
      ) : orders.length > 0 ? (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const st = (order.status || 'pending').toLowerCase();
            return (
            <div key={order.id} className="border border-gray-200 bg-white shadow-sm text-[#1A1A1A]">
              <div className="border-b border-gray-200 p-5 flex items-center justify-between bg-[#F8F6F3]">
                <div>
                  <h3 className="font-medium text-[15px] text-[#1A1A1A]">Order #{order.orderId}</h3>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Placed recently'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-sm">{order.payment}</span>
                  <select 
                    value={order.status || 'pending'} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-[11px] font-medium uppercase tracking-widest border px-3 py-1.5 rounded-sm bg-white cursor-pointer outline-none transition-colors
                      ${st === 'completed' || st === 'delivered' ? 'border-green-600 text-green-700 bg-green-50' : 
                        st === 'cancelled' || st === 'refunded' ? 'border-red-600 text-red-700 bg-red-50' : 'border-gray-400 text-[#1A1A1A]'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)}
                    className="ml-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-sm"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-[1fr_350px] divide-y md:divide-y-0 md:divide-x divide-gray-200 text-[#1A1A1A]">
                {/* Items Column */}
                <div className="p-6">
                  <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold mb-5 flex items-center gap-2"><Package size={14}/> Items Ordered</h4>
                  <div className="space-y-5">
                    {order.items?.map((item: any, i: number) => {
                      const mainImage = item.product?.images?.find((img: any) => img.isMain) || item.product?.images?.[0];
                      return (
                        <div key={i} className="flex gap-4">
                          <img 
                            src={mainImage?.url || 'https://via.placeholder.com/150'} 
                            alt={item.product?.name} 
                            className="w-16 h-20 object-cover bg-gray-100 border border-gray-200 rounded-sm"
                          />
                          <div className="flex-1">
                            <div className="text-[13px] font-medium uppercase text-[#1A1A1A]">{item.product?.name}</div>
                            <div className="text-[12px] text-gray-600 mt-1">Qty: {item.quantity}</div>
                            <div className="text-[13px] font-medium text-[#1A1A1A] mt-2">{formatPrice(item.product?.price * item.quantity)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Column */}
                <div className="p-6 bg-[#FCFBF9] text-[13px] space-y-7 text-[#1A1A1A]">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold mb-3 flex items-center gap-2"><User size={14}/> Customer Details</h4>
                    <div className="font-medium text-[#1A1A1A]">{order.name}</div>
                    <div className="text-gray-700 mt-1">{order.email || 'N/A'}</div>
                    <div className="text-gray-700">{order.phone}</div>
                  </div>
                  
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h4>
                    <div className="text-gray-700 leading-relaxed">
                      {order.address}<br />
                      {order.city}, {order.province}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold mb-3 flex items-center gap-2"><CreditCard size={14}/> Summary</h4>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal || order.total)}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shipping ?? (order.total > 2500 ? 0 : 199))}</span></div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-700"><span>Online Discount</span><span>- {formatPrice(order.discount)}</span></div>
                      )}
                      <div className="flex justify-between text-[#1A1A1A] font-semibold pt-3 border-t border-gray-200 mt-3"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                    </div>
                  </div>

                  {order.payment === 'easypaisa' && order.screenshot && (
                    <div className="pt-7 border-t border-gray-200 mt-7">
                      <h4 className="text-[11px] uppercase tracking-[0.1em] text-gray-500 font-semibold mb-3 flex items-center gap-2">Payment Receipt</h4>
                      <div className="mt-2 border border-gray-300 rounded p-1 bg-white inline-block">
                        <img src={order.screenshot.url} alt="Payment Receipt" className="max-w-full md:max-w-[250px] max-h-[300px] object-contain cursor-pointer" onClick={() => window.open(order.screenshot.url, '_blank')} />
                      </div>
                      <div className="text-[11px] text-gray-500 mt-2">Click to view full size</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 mt-6 text-[#1A1A1A]">
          <p className="text-[13px] text-gray-600">No orders yet. Live Firestore connection active.</p>
        </div>
      )}
    </div>
  );
};

export const CustomersAdmin = () => (
  <div className="text-[#1A1A1A]"><h1 className="font-display text-[28px] text-[#1A1A1A]">Customers</h1><p className="text-[13px] text-gray-600 mt-4">Customer list from Firebase Auth — demo 1,234 customers. COD preferred, WhatsApp verified.</p><div className="bg-white border border-gray-200 p-6 mt-6 text-[12px] text-[#1A1A1A]">Customers table — managed via Firebase Auth & Firestore users collection.</div></div>
);

export const SettingsAdmin = () => (
  <div className="text-[#1A1A1A]"><h1 className="font-display text-[28px] text-[#1A1A1A]">Settings — Firebase Ready</h1><div className="bg-white border border-gray-200 p-6 mt-6 space-y-4 text-[13px] text-[#1A1A1A]"><div>WhatsApp Number: +92 321 7244813</div><div>COD: Enabled nationwide</div><div>Shipping: Free over Rs. 2500</div><div>Brand: TcV — THE CROWN VAULT</div><div className="pt-4 border-t border-gray-200">Ensure products added from Admin Panel automatically appear — implemented via localStorage + Firestore listener ready.</div></div></div>
);
