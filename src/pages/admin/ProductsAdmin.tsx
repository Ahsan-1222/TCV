import { useState } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Plus, Edit3, Trash2, Upload } from 'lucide-react';

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const savedAdmin = localStorage.getItem('tcv_admin_products');
      if (savedAdmin) return JSON.parse(savedAdmin);
      const saved = localStorage.getItem('tcv_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialProducts;
  });
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [form, setForm] = useState<Partial<Product>>({
    name: '', price: 0, comparePrice: 0, stock: 0, category: 'perfume',
    shortDescription: '', description: '', featured: false,
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
    localStorage.setItem('tcv_products', JSON.stringify(list));
  };

  const handleSave = () => {
    if (!form.name) return alert('Name required');
    const finalImages = form.images && form.images.length > 0
      ? form.images
      : [{ url: `https://picsum.photos/seed/${Date.now()}/600/800`, alt: form.name!, isMain: true }];

    const comparePrice = Number(form.comparePrice) || 0;

    const newProduct: Product = {
      id: editing?.id || Math.random().toString(36).slice(2, 9),
      sku: form.sku || `SKU-${Date.now()}`,
      name: form.name!,
      slug: form.name!.toLowerCase().replace(/\s+/g, '-'),
      description: form.description || '',
      shortDescription: form.shortDescription || '',
      category: (form.category as any) || 'perfume',
      price: Number(form.price) || 0,
      comparePrice: comparePrice > 0 ? comparePrice : undefined,
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
    if (editing) list = products.map(p => p.id === editing.id ? { ...newProduct, id: editing.id } : p);
    else list = [newProduct, ...products];
    setProducts(list);
    persist(list);
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete product?')) return;
    const list = products.filter(p => p.id !== id);
    setProducts(list);
    persist(list);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', price: 0, comparePrice: 0, stock: 10, category: 'perfume', shortDescription: '', description: '', featured: false, sku: '', tags: [], images: [] });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p, comparePrice: p.comparePrice || 0 });
    setShowForm(true);
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-[24px] md:text-[28px] text-[#1A1A1A]">Manage Products — {products.length}</h1>
        <button
          onClick={openAdd}
          className="bg-black text-white px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} />Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 p-4 md:p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-[#1A1A1A]">
          <h3 className="md:col-span-2 font-display text-lg text-[#1A1A1A]">{editing ? 'Edit Product' : 'Add New Product'}</h3>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Product Name *</label>
            <input placeholder="e.g. Noir Oud, Rose Luxe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">SKU Code</label>
            <input placeholder="e.g. TCV-NOIR-01" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Price (PKR) *</label>
            <input type="number" placeholder="e.g. 5450" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Cut / Compare Price (PKR)</label>
            <input type="number" placeholder="Original price shown crossed out (e.g. 7500)" value={form.comparePrice || ''} onChange={e => setForm({ ...form, comparePrice: Number(e.target.value) })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
            <p className="text-[10px] text-gray-500 mt-1">Leave 0 to not show a cut price</p>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Stock Quantity</label>
            <input type="number" placeholder="e.g. 100" value={form.stock || ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} className="border border-gray-300 px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black bg-white">
              <option value="perfume">Perfume</option>
              <option value="bags">Bags</option>
              <option value="jewellery">Jewellery</option>
              <option value="watches">Watches</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 text-[12px] text-[#1A1A1A] cursor-pointer font-medium">
              <input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Featured Product (shows on homepage)
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Short Description</label>
            <input placeholder="Short tagline (shown on product cards)" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Full Description</label>
            <textarea placeholder="Full product details, features, scent notes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black" rows={3} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-medium">Product Images (Paste URLs)</label>
            <div className="flex gap-2 mb-2">
              <input placeholder="Paste image URL and press Add..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addImage(); }} className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] flex-1 focus:outline-none focus:border-black" />
              <button onClick={addImage} className="bg-black text-white px-5 py-2 text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0">Add</button>
            </div>
            <div className="flex gap-3 flex-wrap mt-3">
              {(form.images || []).map((img, i) => (
                <div key={i} className="relative w-20 h-24 border border-gray-300">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors">✕</button>
                  {img.isMain && <span className="absolute bottom-1 left-1 bg-black text-white text-[9px] px-1.5 py-0.5">MAIN</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 mt-4">
            <button onClick={handleSave} className="bg-black text-white px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-800 transition-colors">Save Product</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 text-[#1A1A1A] px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors">Cancel</button>
            <span className="ml-auto flex items-center gap-2 text-[11px] text-gray-500"><Upload size={14} /> Multiple Images Supported</span>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 mt-6 overflow-x-auto text-[#1A1A1A]">
        <table className="w-full text-[12px] min-w-[600px] text-[#1A1A1A]">
          <thead className="bg-[#F8F6F3] text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-200">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Cut Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3 hidden md:table-cell">Featured</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-[#1A1A1A]">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors text-[#1A1A1A]">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.images && p.images.length > 0 ? (
                      <img src={(p.images.find(i => i.isMain) || p.images[0]).url} className="w-9 h-11 object-cover bg-[#F8F6F3] border border-gray-200 rounded-sm shrink-0" />
                    ) : (
                      <div className="w-9 h-11 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-sm shrink-0">No img</div>
                    )}
                    <span className="font-medium uppercase text-[#1A1A1A]">{p.name}</span>
                  </div>
                </td>
                <td className="p-3 capitalize text-[#1A1A1A]">{p.category}</td>
                <td className="p-3 font-medium text-[#1A1A1A]">{formatPrice(p.price)}</td>
                <td className="p-3">
                  {p.comparePrice && p.comparePrice > 0
                    ? <span className="line-through text-gray-400">{formatPrice(p.comparePrice)}</span>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="p-3 text-[#1A1A1A]">{p.stock}</td>
                <td className="p-3 hidden md:table-cell text-[#1A1A1A]">{p.featured ? '✓' : '—'}</td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-black hover:text-white transition-colors" title="Edit">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
