import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, Save, Upload, Link as LinkIcon, ArrowUp, ArrowDown, Grid } from 'lucide-react';
import {
  subscribeBanners,
  saveBannersToDB,
  uploadImageFile,
  DEFAULT_BANNERS,
  subscribeCategoryBanners,
  saveCategoryBannersToDB,
  DEFAULT_CATEGORY_BANNERS,
  type CategoryBanner,
  deleteImageFile
} from '../../services/dbService';

export interface BannerSlide {
  image: string;
  subtitle: string;
  heading: string;
  description: string;
  cta: string;
  link?: string;
}

export const BannerAdmin = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'categories'>('hero');

  // Hero Banners State
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_hero_banners_v5') || localStorage.getItem('tcv_hero_banners');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every((s: any) => typeof s?.image === 'string')) {
          return parsed;
        }
      }
      return DEFAULT_BANNERS;
    } catch {
      return DEFAULT_BANNERS;
    }
  });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [urlInputs, setUrlInputs] = useState<string[]>(banners.map(b => b.image));
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Category Banners State (Perfume, Bags, Watches)
  const [categories, setCategories] = useState<CategoryBanner[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_category_banners');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORY_BANNERS;
    } catch {
      return DEFAULT_CATEGORY_BANNERS;
    }
  });
  const [categorySaved, setCategorySaved] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [catUploadingIdx, setCatUploadingIdx] = useState<number | null>(null);
  const [catUrlInputs, setCatUrlInputs] = useState<string[]>(categories.map(c => c.image));
  const catFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const unsubscribeHero = subscribeBanners((slides) => {
      if (slides && slides.length > 0) {
        setBanners(slides);
        setUrlInputs(slides.map(s => s.image));
      }
    });

    const unsubscribeCats = subscribeCategoryBanners((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
        setCatUrlInputs(cats.map(c => c.image));
      }
    });

    return () => {
      unsubscribeHero();
      unsubscribeCats();
    };
  }, []);

  // Hero Banner Handlers
  const save = async (list: BannerSlide[]) => {
    setIsSaving(true);
    try {
      await saveBannersToDB(list);
      setBanners(list);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save banners to DB:', err);
      alert('Failed to save banners to database');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (index: number, field: keyof BannerSlide, value: string) => {
    const list = banners.map((b, i) => i === index ? { ...b, [field]: value } : b);
    setBanners(list);
  };

  const applyUrl = async (index: number) => {
    const url = urlInputs[index]?.trim();
    if (!url) return;
    const list = banners.map((b, i) => i === index ? { ...b, image: url } : b);
    setBanners(list);
    await save(list);
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const uploadedUrl = await uploadImageFile(file, 'banners');
      const list = banners.map((b, i) => i === index ? { ...b, image: uploadedUrl } : b);
      const newUrls = urlInputs.map((u, i) => i === index ? uploadedUrl : u);
      setBanners(list);
      setUrlInputs(newUrls);
      await save(list);
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  const addBanner = () => {
    const newSlide: BannerSlide = {
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=2000',
      subtitle: 'New Collection',
      heading: 'New Banner',
      description: 'Add your description here.',
      cta: 'Shop Now',
    };
    const newList = [...banners, newSlide];
    setBanners(newList);
    setUrlInputs([...urlInputs, newSlide.image]);
  };

  const removeBanner = (index: number) => {
    if (banners.length <= 1) return alert('At least one banner required.');
    const removedBanner = banners[index];
    if (removedBanner?.image) {
      deleteImageFile(removedBanner.image);
    }
    const newList = banners.filter((_, i) => i !== index);
    setBanners(newList);
    setUrlInputs(urlInputs.filter((_, i) => i !== index));
    save(newList);
  };

  const moveBanner = (index: number, dir: 'up' | 'down') => {
    const list = [...banners];
    const urls = [...urlInputs];
    const swapIdx = dir === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    [list[index], list[swapIdx]] = [list[swapIdx], list[index]];
    [urls[index], urls[swapIdx]] = [urls[swapIdx], urls[index]];
    setBanners(list);
    setUrlInputs(urls);
  };

  // Category Banner Handlers
  const saveCategoryBanners = async (list: CategoryBanner[]) => {
    setIsCategorySaving(true);
    try {
      await saveCategoryBannersToDB(list);
      setCategories(list);
      setCategorySaved(true);
      setTimeout(() => setCategorySaved(false), 2500);
    } catch (err) {
      console.error('Failed to save category banners:', err);
      alert('Failed to save category banners to database');
    } finally {
      setIsCategorySaving(false);
    }
  };

  const updateCategoryField = (index: number, field: keyof CategoryBanner, value: string) => {
    const list = categories.map((c, i) => i === index ? { ...c, [field]: value } : c);
    setCategories(list);
  };

  const applyCatUrl = async (index: number) => {
    const url = catUrlInputs[index]?.trim();
    if (!url) return;
    const list = categories.map((c, i) => i === index ? { ...c, image: url } : c);
    setCategories(list);
    await saveCategoryBanners(list);
  };

  const handleCatFileUpload = async (index: number, file: File) => {
    setCatUploadingIdx(index);
    try {
      const uploadedUrl = await uploadImageFile(file, 'category_banners');
      const list = categories.map((c, i) => i === index ? { ...c, image: uploadedUrl } : c);
      const newUrls = catUrlInputs.map((u, i) => i === index ? uploadedUrl : u);
      setCategories(list);
      setCatUrlInputs(newUrls);
      await saveCategoryBanners(list);
    } catch (err) {
      console.error('Category image upload error:', err);
      alert('Failed to upload category image');
    } finally {
      setCatUploadingIdx(null);
    }
  };

  return (
    <div className="text-[#1A1A1A]">
      {/* Header + Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-[#1A1A1A]">Visual Banners & Categories Manager</h1>
          <p className="text-[12px] text-gray-600 mt-1">Manage Hero Slideshow & Homepage Shop By Category images & text dynamically</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 text-[11px] uppercase tracking-widest flex items-center gap-2 transition-colors font-medium ${
              activeTab === 'hero' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
            }`}
          >
            <ImageIcon size={13} /> Hero Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-[11px] uppercase tracking-widest flex items-center gap-2 transition-colors font-medium ${
              activeTab === 'categories' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
            }`}
          >
            <Grid size={13} /> Shop Categories ({categories.length})
          </button>
        </div>
      </div>

      {/* ── TAB 1: HERO SLIDESHOW BANNERS ── */}
      {activeTab === 'hero' && (
        <div className="mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <span className="text-[12px] font-medium text-gray-700">Hero Slideshow ({banners.length} Active Slides)</span>
            <div className="flex gap-2">
              <button onClick={addBanner} className="border border-gray-300 bg-white text-[#1A1A1A] px-4 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-black hover:text-white transition-colors">
                <Plus size={13} />Add Slide
              </button>
              <button
                onClick={() => save(banners)}
                disabled={isSaving}
                className={`px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                <Save size={13} />{isSaving ? 'Saving DB...' : saved ? 'Saved in DB!' : 'Save Banners to DB'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {banners.map((banner, index) => (
              <div key={index} className="bg-white border border-gray-200 text-[#1A1A1A]">
                <div className="flex items-center justify-between px-5 py-3 bg-[#F8F6F3] border-b border-gray-200 text-[#1A1A1A]">
                  <div className="flex items-center gap-2 text-[12px] font-medium text-[#1A1A1A]">
                    <ImageIcon size={14} className="text-gray-500" />
                    Slide {index + 1} of {banners.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveBanner(index, 'up')} disabled={index === 0} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ArrowUp size={12} />
                    </button>
                    <button onClick={() => moveBanner(index, 'down')} disabled={index === banners.length - 1} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ArrowDown size={12} />
                    </button>
                    <button onClick={() => removeBanner(index)} className="w-7 h-7 border border-gray-300 text-[#1A1A1A] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-6 grid md:grid-cols-[240px_1fr] gap-6 text-[#1A1A1A]">
                  <div>
                    <div className="aspect-[3/2] bg-[#F8F6F3] overflow-hidden mb-3 border border-gray-200">
                      <img
                        src={banner.image}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Preview'; }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold flex items-center gap-1">
                        <LinkIcon size={10} />Update via URL
                      </label>
                      <input
                        value={urlInputs[index] || ''}
                        onChange={e => setUrlInputs(urlInputs.map((u, i) => i === index ? e.target.value : u))}
                        placeholder="Paste image URL..."
                        className="w-full border border-gray-300 bg-white px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                      <button
                        onClick={() => applyUrl(index)}
                        className="w-full border border-gray-300 text-[#1A1A1A] px-3 py-2 text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                      >
                        Apply URL
                      </button>

                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mt-3 flex items-center gap-1">
                        <Upload size={10} />Upload Image File
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={el => { fileRefs.current[index] = el; }}
                        onChange={e => { if (e.target.files?.[0]) handleFileUpload(index, e.target.files[0]); }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileRefs.current[index]?.click()}
                        disabled={uploadingIndex === index}
                        className="w-full border border-gray-300 border-dashed text-[#1A1A1A] px-3 py-2.5 text-[11px] uppercase tracking-widest hover:bg-[#F8F6F3] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Upload size={13} />{uploadingIndex === index ? 'Uploading...' : 'Choose Image File'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 text-[#1A1A1A]">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1.5">Subtitle / Collection Label</label>
                      <input
                        value={banner.subtitle}
                        onChange={e => updateField(index, 'subtitle', e.target.value)}
                        placeholder="e.g. The Crown Vault · Signature Collection"
                        className="w-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1.5">Heading (Large Text)</label>
                      <input
                        value={banner.heading}
                        onChange={e => updateField(index, 'heading', e.target.value)}
                        placeholder="e.g. ROOH Fragrances."
                        className="w-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1.5">Description</label>
                      <textarea
                        value={banner.description}
                        onChange={e => updateField(index, 'description', e.target.value)}
                        placeholder="Short description for this banner..."
                        className="w-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-black"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1.5">CTA Button Text</label>
                      <input
                        value={banner.cta}
                        onChange={e => updateField(index, 'cta', e.target.value)}
                        placeholder="e.g. Explore Collection"
                        className="w-full border border-gray-300 bg-white px-4 py-2.5 text-[13px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => save(banners)}
              disabled={isSaving}
              className={`px-6 py-3 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50 ${saved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              <Save size={13} />{isSaving ? 'Saving...' : saved ? '✓ Saved Successfully to DB!' : 'Save All Banners to DB'}
            </button>
            <button
              onClick={async () => {
                if (confirm('Reset to default hero banners?')) {
                  await save(DEFAULT_BANNERS);
                  setUrlInputs(DEFAULT_BANNERS.map(b => b.image));
                }
              }}
              className="border border-gray-300 text-[#1A1A1A] bg-white px-6 py-3 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: SHOP BY CATEGORY CARDS ── */}
      {activeTab === 'categories' && (
        <div className="mt-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <span className="text-[12px] font-medium text-gray-700">Shop By Category Cards (3 Main Homepage Cards)</span>
            <button
              onClick={() => saveCategoryBanners(categories)}
              disabled={isCategorySaving}
              className={`px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50 ${categorySaved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              <Save size={13} />{isCategorySaving ? 'Saving DB...' : categorySaved ? 'Saved in DB!' : 'Save Categories to DB'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div key={cat.slug || index} className="bg-white border border-gray-200 text-[#1A1A1A] flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-[#F8F6F3] border-b border-gray-200 text-[#1A1A1A]">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#1A1A1A]">
                    <Grid size={14} className="text-crown-gold" />
                    Category {index + 1}: {cat.title}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 bg-gray-200 px-2 py-0.5 rounded-xs">
                    /{cat.slug}
                  </span>
                </div>

                <div className="p-4 flex-1 space-y-4 text-[#1A1A1A]">
                  {/* Category Image Preview */}
                  <div className="aspect-[4/3] bg-[#F8F6F3] overflow-hidden border border-gray-200 relative group">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Category+Image'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] uppercase tracking-widest pointer-events-none">
                      Preview
                    </div>
                  </div>

                  {/* Image Upload / URL Controls */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold flex items-center gap-1">
                      <LinkIcon size={10} />Update via Image URL
                    </label>
                    <input
                      value={catUrlInputs[index] || ''}
                      onChange={e => setCatUrlInputs(catUrlInputs.map((u, i) => i === index ? e.target.value : u))}
                      placeholder="Paste category image URL..."
                      className="w-full border border-gray-300 bg-white px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={() => applyCatUrl(index)}
                      className="w-full border border-gray-300 text-[#1A1A1A] px-3 py-2 text-[11px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    >
                      Apply Image URL
                    </button>

                    <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mt-3 flex items-center gap-1">
                      <Upload size={10} />Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={el => { catFileRefs.current[index] = el; }}
                      onChange={e => { if (e.target.files?.[0]) handleCatFileUpload(index, e.target.files[0]); }}
                      className="hidden"
                    />
                    <button
                      onClick={() => catFileRefs.current[index]?.click()}
                      disabled={catUploadingIdx === index}
                      className="w-full border border-gray-300 border-dashed text-[#1A1A1A] px-3 py-2.5 text-[11px] uppercase tracking-widest hover:bg-[#F8F6F3] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Upload size={13} />{catUploadingIdx === index ? 'Compressing & Uploading...' : 'Choose Image File'}
                    </button>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1">Category Title</label>
                      <input
                        value={cat.title}
                        onChange={e => updateCategoryField(index, 'title', e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-black font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1">Subtitle Label</label>
                      <input
                        value={cat.label}
                        onChange={e => updateCategoryField(index, 'label', e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-700 font-semibold mb-1">Description Tagline</label>
                      <input
                        value={cat.desc}
                        onChange={e => updateCategoryField(index, 'desc', e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 text-[12px] text-[#1A1A1A] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => saveCategoryBanners(categories)}
              disabled={isCategorySaving}
              className={`px-6 py-3 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors disabled:opacity-50 ${categorySaved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              <Save size={13} />{isCategorySaving ? 'Saving...' : categorySaved ? '✓ Saved Successfully to DB!' : 'Save All Categories to DB'}
            </button>
            <button
              onClick={async () => {
                if (confirm('Reset to default category images?')) {
                  await saveCategoryBanners(DEFAULT_CATEGORY_BANNERS);
                  setCatUrlInputs(DEFAULT_CATEGORY_BANNERS.map(c => c.image));
                }
              }}
              className="border border-gray-300 text-[#1A1A1A] bg-white px-6 py-3 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
