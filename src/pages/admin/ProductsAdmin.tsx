import { useState, useEffect, useRef } from 'react';
import { products as initialProducts } from '../../data/products';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Plus, Edit3, Trash2, Upload, Image as ImageIcon, ArrowUp, ArrowDown, Save, Check, ListOrdered, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeProducts, saveProductToDB, deleteProductFromDB, uploadImageFile, saveProductSequenceToDB, sortProductsBySequence, deleteImageFile, getDeletedProductIds } from '../../services/dbService';

export const ProductsAdmin = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const deletedIds = getDeletedProductIds();
    try {
      const savedAdmin = localStorage.getItem('tcv_admin_products');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortProductsBySequence(parsed.filter((p: Product) => !deletedIds.includes(p.id)));
        }
      }
      const saved = localStorage.getItem('tcv_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortProductsBySequence(parsed.filter((p: Product) => !deletedIds.includes(p.id)));
        }
      }
    } catch { }
    return sortProductsBySequence(initialProducts.filter(p => !deletedIds.includes(p.id)));
  });
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSequence, setIsSavingSequence] = useState(false);
  const [sequenceSaved, setSequenceSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<Partial<Product>>({
    name: '', price: 0, comparePrice: 0, stock: 0, category: 'perfume',
    shortDescription: '', description: '', featured: false,
    sku: '', tags: [], images: [], displayOrder: 1
  });
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dragOverImageIndex, setDragOverImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeProducts((prods) => {
      if (prods && prods.length > 0) setProducts(sortProductsBySequence(prods));
    });
    return () => unsubscribe();
  }, []);

  const handleSaveSequence = async (listToSave: Product[] = products) => {
    setIsSavingSequence(true);
    try {
      await saveProductSequenceToDB(listToSave);
      setSequenceSaved(true);
      setTimeout(() => setSequenceSaved(false), 3000);
    } catch (err) {
      console.error('Error saving sequence:', err);
      alert('Failed to save product sequence.');
    } finally {
      setIsSavingSequence(false);
    }
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    const reordered = updated.map((p, i) => ({ ...p, displayOrder: i + 1 }));
    setProducts(reordered);
    handleSaveSequence(reordered);
  };

  const moveDown = (index: number) => {
    if (index >= products.length - 1) return;
    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    const reordered = updated.map((p, i) => ({ ...p, displayOrder: i + 1 }));
    setProducts(reordered);
    handleSaveSequence(reordered);
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setForm(prev => ({
      ...prev,
      images: [...(prev.images || []), { url: newImageUrl.trim(), alt: prev.name || 'Product Image', isMain: (prev.images || []).length === 0 }]
    }));
    setNewImageUrl('');
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageFile(file, 'products');
      setForm(prev => ({
        ...prev,
        images: [...(prev.images || []), { url: uploadedUrl, alt: prev.name || 'Product Image', isMain: (prev.images || []).length === 0 }]
      }));
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const targetImage = form.images?.[index];
    if (targetImage?.url) {
      deleteImageFile(targetImage.url);
    }
    setForm(prev => {
      const newImgs = (prev.images || []).filter((_, i) => i !== index);
      if (newImgs.length > 0 && !newImgs.some(i => i.isMain)) {
        newImgs[0].isMain = true;
      }
      return { ...prev, images: newImgs };
    });
  };

  const updateImageColor = (index: number, color: string) => {
    setForm(prev => ({
      ...prev,
      images: (prev.images || []).map((img, i) => i === index ? { ...img, color } : img)
    }));
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    setForm(prev => {
      const list = [...(prev.images || [])];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return {
        ...prev,
        images: list.map((img, idx) => ({ ...img, isMain: idx === 0 }))
      };
    });
  };

  const moveImageStep = (fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= (form.images || []).length) return;
    handleImageReorder(fromIndex, toIndex);
  };

  const handleSave = async () => {
    if (!form.name) return alert('Name required');
    setIsSaving(true);
    try {
      const finalImages = form.images && form.images.length > 0
        ? form.images
        : [{ url: `https://picsum.photos/seed/${Date.now()}/600/800`, alt: form.name!, isMain: true }];

      const comparePrice = Number(form.comparePrice) || 0;
      const targetDisplayOrder = form.displayOrder && Number(form.displayOrder) > 0
        ? Number(form.displayOrder)
        : (editing?.displayOrder || products.length + 1);

      const generatedSlug = form.name!.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const newProduct: Product = {
        id: editing?.id || (generatedSlug ? `prod-${generatedSlug}` : `prod-${Date.now()}`),
        sku: form.sku || `SKU-${Date.now()}`,
        name: form.name!,
        slug: generatedSlug,
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
        displayOrder: targetDisplayOrder,
      };

      await saveProductToDB(newProduct);

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error('Error saving product to DB:', err);
      alert('Error saving product to database');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete product?')) return;
    try {
      await deleteProductFromDB(id);
    } catch (err) {
      console.error('Error deleting product from DB:', err);
      alert('Error deleting product from database');
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: '', price: 0, comparePrice: 0, stock: 10, category: 'perfume',
      shortDescription: '', description: '', featured: false, sku: '', tags: [], images: [],
      displayOrder: products.length + 1
    });
    setShowForm(true);
  };

  const openEdit = (p: Product, index: number) => {
    setEditing(p);
    setForm({
      ...p,
      comparePrice: p.comparePrice || 0,
      displayOrder: p.displayOrder || (index + 1)
    });
    setShowForm(true);
  };

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-[#1A1A1A]">Manage Products — {products.length}</h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">Use sequence controls below to change product display order</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleSaveSequence()}
            disabled={isSavingSequence}
            className="border border-black text-black px-4 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
            title="Save Product Display Sequence"
          >
            {sequenceSaved ? <Check size={14} className="text-green-600" /> : <Save size={14} />}
            {isSavingSequence ? 'Saving Sequence...' : sequenceSaved ? 'Sequence Saved!' : 'Save Sequence'}
          </button>
          <button
            onClick={openAdd}
            className="bg-black text-white px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} />Add Product
          </button>
        </div>
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
              <option value="watches">Watches</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-gray-700 mb-2 font-semibold flex items-center gap-1.5 text-black">
              <ListOrdered size={14} className="text-[#C9A86A]" /> Product Sequence / Display Order
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 1 (Appears 1st on website)"
              value={form.displayOrder || ''}
              onChange={e => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className="border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] w-full focus:outline-none focus:border-black"
            />
            <p className="text-[10px] text-gray-500 mt-1">Lower numbers appear first on the public website (1, 2, 3...)</p>
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

          {/* Product Images section */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="block text-[11px] uppercase tracking-widest text-gray-700 font-semibold">
                Product Images (Save Dynamically to DB)
              </label>
              <span className="text-[11px] text-gray-500 font-normal">
                Drag cards to reorder sequence or use arrows (← / →)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <input placeholder="Paste image URL and click Add..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addImage(); }} className="border border-gray-300 bg-white px-4 py-2 text-[13px] text-[#1A1A1A] flex-1 focus:outline-none focus:border-black min-w-[200px]" />
              <button type="button" onClick={addImage} className="bg-black text-white px-5 py-2 text-[11px] uppercase tracking-widest hover:bg-gray-800 transition-colors shrink-0">Add URL</button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="border border-gray-300 bg-white text-[#1A1A1A] px-4 py-2 text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Upload size={13} /> {isUploading ? 'Uploading...' : 'Upload Image File'}
              </button>
            </div>

            <div className="flex gap-4 flex-wrap mt-3">
              {(form.images || []).map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('input') || target.closest('button')) {
                      e.preventDefault();
                      return;
                    }
                    setDraggedImageIndex(i);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', `${i}`);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverImageIndex !== i) {
                      setDragOverImageIndex(i);
                    }
                  }}
                  onDragLeave={() => {
                    if (dragOverImageIndex === i) {
                      setDragOverImageIndex(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedImageIndex !== null && draggedImageIndex !== i) {
                      handleImageReorder(draggedImageIndex, i);
                    }
                    setDraggedImageIndex(null);
                    setDragOverImageIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedImageIndex(null);
                    setDragOverImageIndex(null);
                  }}
                  className={`relative w-32 border p-1.5 flex flex-col items-center group transition-all select-none cursor-grab active:cursor-grabbing ${draggedImageIndex === i
                      ? 'opacity-30 border-dashed border-black scale-95 bg-gray-200'
                      : dragOverImageIndex === i
                        ? 'border-black ring-2 ring-black bg-blue-50/60 scale-105 shadow-md'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  title="Drag card or use arrows to change sequence"
                >
                  <div className="relative w-full h-24 overflow-hidden mb-1.5 pointer-events-none">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <span className={`absolute top-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${i === 0 ? 'bg-black' : 'bg-black/75'}`}>
                      #{i + 1}{i === 0 ? ' • Main' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors z-10 pointer-events-auto shadow-sm"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    placeholder="Color (e.g. Black, Gold)"
                    value={img.color || ''}
                    draggable={false}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={e => updateImageColor(i, e.target.value)}
                    className="w-full text-[10px] border border-gray-300 px-1.5 py-1 bg-white focus:outline-none focus:border-black text-[#1A1A1A] cursor-text"
                  />

                  <div className="flex items-center justify-between w-full mt-1.5 pt-1 border-t border-gray-200">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImageStep(i, 'left');
                      }}
                      title="Move Left"
                      className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="text-[9px] font-medium text-gray-500 flex items-center gap-0.5 pointer-events-none">
                      <GripVertical size={11} className="text-gray-400" /> #{i + 1}
                    </span>
                    <button
                      type="button"
                      disabled={i === (form.images || []).length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImageStep(i, 'right');
                      }}
                      title="Move Right"
                      className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 mt-4">
            <button onClick={handleSave} disabled={isSaving} className="bg-black text-white px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50">
              {isSaving ? 'Saving to DB...' : 'Save Product'}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="border border-gray-300 text-[#1A1A1A] px-6 py-2.5 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors">Cancel</button>
            <span className="ml-auto flex items-center gap-2 text-[11px] text-gray-500"><ImageIcon size={14} /> Dynamically Saved to Database</span>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 mt-6 overflow-x-auto text-[#1A1A1A]">
        <table className="w-full text-[12px] min-w-[700px] text-[#1A1A1A]">
          <thead className="bg-[#F8F6F3] text-[11px] uppercase tracking-widest text-gray-700 border-b border-gray-200">
            <tr>
              <th className="text-center p-3 w-28">Order / Sequence</th>
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
            {products.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors text-[#1A1A1A]">
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-7 h-7 rounded bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-800 flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="w-5 h-4 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black"
                        title="Move Up"
                      >
                        <ArrowUp size={10} />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === products.length - 1}
                        className="w-5 h-4 bg-gray-100 hover:bg-black hover:text-white border border-gray-200 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-black"
                        title="Move Down"
                      >
                        <ArrowDown size={10} />
                      </button>
                    </div>
                  </div>
                </td>
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
                    <button onClick={() => openEdit(p, index)} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-black hover:text-white transition-colors" title="Edit">
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
