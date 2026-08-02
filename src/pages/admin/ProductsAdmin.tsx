import { useState } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Plus, Edit3, Trash2, Upload } from 'lucide-react';

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tcv_admin_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [form, setForm] = useState<Partial<Product>>({
    name: '', price: 0, stock: 0, category: 'perfume', shortDescription: '', description: '', featured: false,
    sku: '', tags: [], images: []
  });

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...(prev.images || []), { url: newImageUrl.trim(), alt: prev.name || 'Product Image', isMain: (prev.images || []).length === 0 }]
    }));
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const persist = (list: Product[]) => {
    localStorage.setItem('tcv_admin_products', JSON.stringify(list));
    // Also update main product list that appears on site by updating localStorage that Shop reads? For demo we keep separate, but we sync to tcv_products
    localStorage.setItem('tcv_products', JSON.stringify(list));
  };

  const handleSave = () => {
    if (!form.name) return alert('Name required');
    const finalImages = form.images && form.images.length > 0 
      ? form.images 
      : [{ url: `https://picsum.photos/seed/${Date.now()}/600/800`, alt: form.name!, isMain: true }];

    const newProduct: Product = {
      id: editing?.id || Math.random().toString(36).slice(2,9),
      sku: form.sku || `SKU-${Date.now()}`,
      name: form.name!,
      slug: form.name!.toLowerCase().replace(/\s+/g,'-'),
      description: form.description || '',
      shortDescription: form.shortDescription || '',
      category: (form.category as any) || 'perfume',
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      images: finalImages,
      tags: form.tags || [],
      featured: !!form.featured,
      rating: editing?.rating || 4.8,
      reviewCount: editing?.reviewCount || 0,
      reviews: editing?.reviews || [],
      createdAt: editing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let list;
    if (editing) list = products.map(p=>p.id===editing.id?{...newProduct, id: editing.id}:p);
    else list = [newProduct, ...products];
    setProducts(list);
    persist(list);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete product?')) return;
    const list = products.filter(p=>p.id!==id);
    setProducts(list);
    persist(list);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[28px]">Manage Products — {products.length}</h1>
        <button onClick={()=>{setEditing(null); setForm({name:'',price:0,stock:10,category:'perfume',shortDescription:'',description:'',featured:false,sku:'',tags:[],images:[]}); setShowForm(true);}} className="bg-black text-white px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2"><Plus size={14}/>Add Product</button>
      </div>

      {showForm && (
        <div className="bg-white border p-6 mt-6 grid md:grid-cols-2 gap-4">
          <h3 className="md:col-span-2 font-display text-lg">{editing?'Edit Product':'Add New Product — Firebase Storage Ready'}</h3>
          <div>
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Product Name</label>
            <input placeholder="Product Name (e.g. Noir, Aqua)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border px-4 py-2.5 text-[13px] w-full" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">SKU Code</label>
            <input placeholder="SKU Code (e.g. TCV-NOIR-01)" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="border px-4 py-2.5 text-[13px] w-full" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Price (PKR)</label>
            <input type="number" placeholder="Price in PKR (e.g. 5450)" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} className="border px-4 py-2.5 text-[13px] w-full" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Stock Quantity</label>
            <input type="number" placeholder="Available Stock (e.g. 100)" value={form.stock} onChange={e=>setForm({...form,stock:Number(e.target.value)})} className="border px-4 py-2.5 text-[13px] w-full" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Category</label>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value as any})} className="border px-4 py-2.5 text-[13px] w-full">
              <option value="perfume">Perfume</option><option value="bags">Bags</option><option value="jewellery">Jewellery</option><option value="watches">Watches</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={!!form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /> Featured Product</label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Short Description</label>
            <input placeholder="Short Description (Appears on product cards)" value={form.shortDescription} onChange={e=>setForm({...form,shortDescription:e.target.value})} className="border px-4 py-2.5 text-[13px] w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-widest opacity-60 mb-2">Full Description</label>
            <textarea placeholder="Full Product Description (Features, notes, and details...)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="border px-4 py-2.5 text-[13px] w-full" rows={3} />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-[12px] mb-1 opacity-70">Product Images (URLs)</label>
            <div className="flex gap-2 mb-2">
              <input placeholder="Paste Image URL here..." value={newImageUrl} onChange={e=>setNewImageUrl(e.target.value)} onKeyDown={e=>{if(e.key==='Enter') addImage();}} className="border px-4 py-2.5 text-[13px] flex-1" />
              <button onClick={addImage} className="bg-black text-white px-5 py-2 text-[11px] uppercase tracking-widest">Add</button>
            </div>
            <div className="flex gap-3 flex-wrap mt-3">
              {(form.images || []).map((img, i) => (
                <div key={i} className="relative w-20 h-24 border">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors">✕</button>
                  {img.isMain && <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] px-1.5 py-0.5">MAIN</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 mt-4">
            <button onClick={handleSave} className="bg-black text-white px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-800 transition-colors">Save Product</button>
            <button onClick={()=>setShowForm(false)} className="border px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors">Cancel</button>
            <span className="ml-auto flex items-center gap-2 text-[11px] opacity-50"><Upload size={14}/> Support Multiple Images</span>
          </div>
        </div>
      )}

      <div className="bg-white border mt-6 overflow-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-[#F8F6F3] text-[11px] uppercase tracking-widest"><tr><th className="text-left p-3">Product</th><th className="text-left p-3">Category</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Featured</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {products.map(p=>(
              <tr key={p.id} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  {p.images && p.images.length > 0 ? (
                    <img src={(p.images.find(i=>i.isMain)||p.images[0]).url} className="w-10 h-12 object-cover bg-[#F8F6F3] rounded-sm" />
                  ) : (
                    <div className="w-10 h-12 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-sm">No img</div>
                  )}
                  <span className="font-medium uppercase">{p.name}</span>
                </td>
                <td className="p-3 capitalize">{p.category}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.featured?'Yes':'No'}</td>
                <td className="p-3 text-right flex gap-2 justify-end">
                  <button onClick={()=>{setEditing(p); setForm(p); setShowForm(true);}} className="w-7 h-7 border flex items-center justify-center hover:bg-black hover:text-white"><Edit3 size={12}/></button>
                  <button onClick={()=>handleDelete(p.id)} className="w-7 h-7 border flex items-center justify-center hover:bg-red-600 hover:text-white"><Trash2 size={12}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
