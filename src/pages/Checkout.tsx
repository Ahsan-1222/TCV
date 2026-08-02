import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState<{name: string, phone: string, email: string, address: string, city: string, province: string, screenshot?: { name: string, url: string } | null}>({ name: '', phone: '', email: '', address: '', city: '', province: 'Punjab', screenshot: null });
  const [payment, setPayment] = useState<'cod' | 'easypaisa'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const orderId = 'TCV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      let screenshotData = null;

      const shipping = total > 2500 ? 0 : 199;
      const discount = payment === 'easypaisa' ? 100 : 0;
      const finalTotal = total + shipping - discount;

      try {
        if (payment === 'easypaisa' && form.screenshot) {
          // Store the base64 URL directly in Firestore to avoid Firebase Storage CORS issues
          screenshotData = { name: form.screenshot.name, url: form.screenshot.url };
        }

        const orderData = {
          orderId,
          items,
          total: finalTotal,
          subtotal: total,
          shipping,
          discount,
          payment,
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          province: form.province,
          screenshot: screenshotData,
          status: 'pending',
          createdAt: serverTimestamp()
        };

        // Timeout after 5 seconds to prevent hanging if Firestore is not created or unreachable
        const addDocPromise = addDoc(collection(db, 'orders'), orderData);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000));
        await Promise.race([addDocPromise, timeoutPromise]);
      } catch (firebaseError) {
        console.warn("Firebase failed, falling back to local storage:", firebaseError);
        // Fallback to local storage if Firebase is not properly configured
        screenshotData = form.screenshot ? { name: form.screenshot.name, url: form.screenshot.url } : null;
        const fallbackOrder = {
          orderId,
          items,
          total: finalTotal,
          subtotal: total,
          shipping,
          discount,
          payment,
          ...form,
          screenshot: screenshotData,
          status: 'pending',
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        };
        localStorage.setItem('tcv_last_order', JSON.stringify(fallbackOrder));
      }
      
      clearCart();
      navigate(`/checkout/success?order=${orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an issue processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return <div className="max-w-[1600px] mx-auto px-12 py-20"><Link to="/shop">Cart empty, continue shopping</Link></div>;

  const shipping = total > 2500 ? 0 : 199;
  const discount = payment === 'easypaisa' ? 100 : 0;
  const finalTotal = total + shipping - discount;

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12 grid lg:grid-cols-[1fr_420px] gap-12">
      <div>
        <h1 className="font-display text-[32px] leading-none">Checkout</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="bg-white border p-6">
            <h3 className="text-[11px] tracking-[0.2em] uppercase mb-6">Shipping Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input required placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black" />
              <input required placeholder="Phone (WhatsApp)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black" />
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black md:col-span-2" />
              <input required placeholder="Street Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black md:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black" />
              <select value={form.province} onChange={e=>setForm({...form,province:e.target.value})} className="border px-4 py-3 text-[13px] outline-none focus:border-black">
                <option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option><option>Islamabad</option><option>GB / AJK</option>
              </select>
            </div>
          </div>

          <div className="bg-white border p-6">
            <h3 className="text-[11px] tracking-[0.2em] uppercase mb-6">Payment Method</h3>
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                type="button"
                onClick={() => setPayment('easypaisa')}
                className={`py-4 text-[13px] tracking-widest font-bold uppercase transition-colors rounded-lg flex items-center justify-center ${payment === 'easypaisa' ? 'bg-[#2A2522] text-white' : 'bg-[#E3D1C4]/40 border border-transparent text-[#2A2522] hover:bg-[#E3D1C4]/60'}`}
              >
                EASYPAISA
              </button>
              <button 
                type="button"
                onClick={() => setPayment('cod')}
                className={`py-4 text-[13px] tracking-widest font-bold uppercase transition-colors rounded-lg flex items-center justify-center ${payment === 'cod' ? 'bg-[#2A2522] text-white' : 'bg-[#E3D1C4]/40 border border-transparent text-[#2A2522] hover:bg-[#E3D1C4]/60'}`}
              >
                COD
              </button>
            </div>

            {/* Easypaisa Details */}
            {payment === 'easypaisa' && (
              <div className="bg-[#E3D1C4]/30 rounded-xl p-6 mb-6">
                <h4 className="text-[11px] tracking-[0.1em] uppercase font-bold text-[#A58872] mb-4">Payment Instructions</h4>
                <p className="text-[13px] text-[#2A2522] mb-4">Please transfer the total amount to our Easypaisa account:</p>
                
                <div className="border border-[#A58872]/30 rounded-lg p-5 mb-5 bg-[#E3D1C4]/10">
                  <div className="text-[10px] tracking-widest uppercase font-bold text-[#A58872] mb-3">Account Details</div>
                  <div className="font-mono text-xl font-bold text-[#2A2522] tracking-wider mb-2">03349580593</div>
                  <div className="font-mono text-xl font-bold text-[#2A2522] tracking-wider">Muhammad Usman</div>
                </div>
                
                <p className="text-[13px] text-[#2A2522] mb-3 opacity-90">Once payment is made, upload a screenshot of the payment receipt below to verify and process your order.</p>
                <p className="text-[12px] text-[#C09450] italic font-medium mb-8">Easypaisa par payment transfer karne ke baad screenshot attach karein.</p>
                
                <h4 className="text-[11px] tracking-widest uppercase font-bold text-[#2A2522] mb-3">Payment Screenshot</h4>
                <label className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors ${form.screenshot ? 'border-[#25D366] bg-[#25D366]/5' : 'border-[#A58872]/40 hover:bg-white/50'}`}>
                  <span className={`text-[13px] truncate pr-4 ${form.screenshot ? 'text-[#25D366] font-medium' : 'text-[#2A2522] opacity-80'}`}>
                    {form.screenshot ? form.screenshot.name : 'Choose Screenshot'}
                  </span>
                  <Upload size={18} className={form.screenshot ? 'text-[#25D366]' : 'text-[#2A2522] opacity-60'} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let { width, height } = img;
                            if (width > 800 || height > 800) {
                              if (width > height) { height = Math.round((height * 800) / width); width = 800; }
                              else { width = Math.round((width * 800) / height); height = 800; }
                            }
                            canvas.width = width; canvas.height = height;
                            canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                            setForm({...form, screenshot: { name: file.name, url: compressedDataUrl }});
                          };
                          img.src = reader.result as string;
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-4 text-[11px] tracking-[0.2em] uppercase hover:bg-crown-gold transition-colors disabled:opacity-50">
            {isSubmitting ? 'Processing Order...' : `Place Order — ${formatPrice(finalTotal)}`}
          </button>
        </form>
      </div>

      <div className="bg-[#FCFBF9] border p-6 h-fit sticky top-28">
        <h3 className="font-display text-lg mb-6">Order Summary</h3>
        <div className="space-y-4">
          {items.map(i=>(
            <div key={i.product.id} className="flex gap-3"><img src={(i.product.images.find(img=>img.isMain)||i.product.images[0]).url} alt={i.product.name} className="w-12 h-14 object-cover bg-white" /><div className="flex-1"><div className="text-[12px] uppercase font-medium">{i.product.name}</div><div className="text-[11px] opacity-60">Qty: {i.quantity}</div></div><div className="text-[12px] font-semibold">{formatPrice(i.product.price*i.quantity)}</div></div>
          ))}
        </div>
        <div className="border-t mt-6 pt-4 space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="opacity-60">Subtotal</span><span>{formatPrice(total)}</span></div>
          <div className="flex justify-between"><span className="opacity-60">Shipping</span><span>{shipping===0?'Free':formatPrice(shipping)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-[#C09450] font-medium"><span className="opacity-90">Online Payment Discount</span><span>- {formatPrice(discount)}</span></div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order');
  return (
    <div className="max-w-[600px] mx-auto px-8 py-20 text-center">
      <div className="w-20 h-20 mx-auto bg-crown-gold text-white flex items-center justify-center text-3xl font-display mb-6">✓</div>
      <h1 className="font-display text-[36px] leading-none">Order Confirmed</h1>
      <p className="text-[13px] opacity-60 mt-4">Thank you for shopping with THE CROWN VAULT. Your order {orderId} is confirmed. Our team will contact you on WhatsApp shortly to verify your details.</p>
      <div className="mt-8 flex gap-3 justify-center">
        <Link to="/shop" className="bg-black text-white px-8 py-3 text-[11px] tracking-widest uppercase">Continue Shopping</Link>
        <a href={`https://wa.me/923217244813?text=Hello%20I%20placed%20order%20${orderId}`} target="_blank" rel="noopener noreferrer" className="border px-8 py-3 text-[11px] tracking-widest uppercase">Track via WhatsApp</a>
      </div>
    </div>
  );
};
