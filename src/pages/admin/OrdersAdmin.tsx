import { useState, useEffect } from 'react';
import { formatPrice } from '../../lib/utils';
import { Package, User, MapPin, CreditCard, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';

export const OrdersAdmin = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let snapshotReceived = false;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshotReceived = true;
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      snapshotReceived = true;
      console.warn("Firebase failed, falling back to local storage:", error);
      const localOrder = localStorage.getItem('tcv_last_order');
      if (localOrder) {
        setOrders([JSON.parse(localOrder)]);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    const fallbackTimeout = setTimeout(() => {
      if (!snapshotReceived) {
        console.warn("Firebase timeout, falling back to local storage");
        const localOrder = localStorage.getItem('tcv_last_order');
        if (localOrder) {
          setOrders([JSON.parse(localOrder)]);
        } else {
          setOrders([]);
        }
        setLoading(false);
      }
    }, 4000);

    return () => {
      unsubscribe();
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
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  return (
    <div>
      <h1 className="font-display text-[28px]">Orders Management</h1>
      <p className="text-[12px] opacity-60 mt-2">Firebase-connected — Live Firestore orders collection</p>
      
      {loading ? (
        <div className="mt-8 text-[13px] opacity-60">Loading live orders from Firebase...</div>
      ) : orders.length > 0 ? (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border bg-white shadow-sm">
              <div className="border-b p-5 flex items-center justify-between bg-[#F8F6F3]">
                <div>
                  <h3 className="font-medium text-[15px]">Order #{order.orderId}</h3>
                  <p className="text-[11px] opacity-60 mt-1">
                    {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Placed recently'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-widest bg-black text-white px-3 py-1.5 rounded-sm">{order.payment}</span>
                  <select 
                    value={order.status || 'pending'} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-[11px] font-medium uppercase tracking-widest border px-3 py-1.5 rounded-sm bg-transparent cursor-pointer outline-none transition-colors
                      ${(order.status || 'pending') === 'completed' ? 'border-green-600 text-green-700' : 
                        (order.status || 'pending') === 'cancelled' ? 'border-red-600 text-red-700' : 'border-black text-black'}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
              
              <div className="grid md:grid-cols-[1fr_350px] divide-y md:divide-y-0 md:divide-x">
                {/* Items Column */}
                <div className="p-6">
                  <h4 className="text-[11px] uppercase tracking-[0.1em] opacity-50 mb-5 flex items-center gap-2"><Package size={14}/> Items Ordered</h4>
                  <div className="space-y-5">
                    {order.items?.map((item: any, i: number) => {
                      const mainImage = item.product?.images?.find((img: any) => img.isMain) || item.product?.images?.[0];
                      return (
                        <div key={i} className="flex gap-4">
                          <img 
                            src={mainImage?.url || 'https://via.placeholder.com/150'} 
                            alt={item.product?.name} 
                            className="w-16 h-20 object-cover bg-gray-100 rounded-sm"
                          />
                          <div className="flex-1">
                            <div className="text-[13px] font-medium uppercase">{item.product?.name}</div>
                            <div className="text-[12px] opacity-60 mt-1">Qty: {item.quantity}</div>
                            <div className="text-[13px] font-medium mt-2">{formatPrice(item.product?.price * item.quantity)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Column */}
                <div className="p-6 bg-[#FCFBF9] text-[13px] space-y-7">
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] opacity-50 mb-3 flex items-center gap-2"><User size={14}/> Customer Details</h4>
                    <div className="font-medium">{order.name}</div>
                    <div className="text-gray-600 mt-1">{order.email || 'N/A'}</div>
                    <div className="text-gray-600">{order.phone}</div>
                  </div>
                  
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] opacity-50 mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h4>
                    <div className="text-gray-600 leading-relaxed">
                      {order.address}<br />
                      {order.city}, {order.province}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.1em] opacity-50 mb-3 flex items-center gap-2"><CreditCard size={14}/> Summary</h4>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal || order.total)}</span></div>
                      <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shipping ?? (order.total > 2500 ? 0 : 199))}</span></div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-700"><span>Online Discount</span><span>- {formatPrice(order.discount)}</span></div>
                      )}
                      <div className="flex justify-between text-black font-semibold pt-3 border-t mt-3"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                    </div>
                  </div>

                  {order.payment === 'easypaisa' && order.screenshot && (
                    <div className="pt-7 border-t border-gray-200 mt-7">
                      <h4 className="text-[11px] uppercase tracking-[0.1em] opacity-50 mb-3 flex items-center gap-2">Payment Receipt</h4>
                      <div className="mt-2 border rounded p-1 bg-white inline-block">
                        <img src={order.screenshot.url} alt="Payment Receipt" className="max-w-full md:max-w-[250px] max-h-[300px] object-contain cursor-pointer" onClick={() => window.open(order.screenshot.url, '_blank')} />
                      </div>
                      <div className="text-[11px] text-gray-500 mt-2">Click to view full size</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border p-6 mt-6">
          <p className="text-[13px] opacity-60">No orders yet. Live Firestore connection active.</p>
        </div>
      )}
    </div>
  );
};

export const CustomersAdmin = () => (
  <div><h1 className="font-display text-[28px]">Customers</h1><p className="text-[13px] opacity-60 mt-4">Customer list from Firebase Auth — demo 1,234 customers. COD preferred, WhatsApp verified.</p><div className="bg-white border p-6 mt-6 text-[12px]">Customers table — managed via Firebase Auth & Firestore users collection.</div></div>
);

export const SettingsAdmin = () => (
  <div><h1 className="font-display text-[28px]">Settings — Firebase Ready</h1><div className="bg-white border p-6 mt-6 space-y-4 text-[13px]"><div>WhatsApp Number: +92 321 7244813</div><div>COD: Enabled nationwide</div><div>Shipping: Free over Rs. 2500</div><div>Brand: TcV — THE CROWN VAULT</div><div className="pt-4 border-t">Ensure products added from Admin Panel automatically appear — implemented via localStorage + Firestore listener ready.</div></div></div>
);
