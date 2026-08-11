import { useState, useRef } from 'react';
import { Image, Plus, Trash2, Save, Upload, Link as LinkIcon, ArrowUp, ArrowDown } from 'lucide-react';

const DEFAULT_BANNERS = [
  {
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (4).jpeg')}`,
    subtitle: 'The Crown Vault · Signature Collection',
    heading: 'ROOH Fragrances.',
    description: 'A meticulously curated collection of fine products, crafted for those who appreciate understated elegance.',
    cta: 'Explore Collection',
  },
  {
    image: 'https://i.etsystatic.com/33947445/r/il/b920da/7450829026/il_1588xN.7450829026_k26r.jpg',
    subtitle: 'Heritage · Timeless Pieces',
    heading: 'Modern Elegance',
    description: 'Preserving the legacy of artisanal craftsmanship. Aesthetic designs crafted to transcend generations.',
    cta: 'Discover Heritage',
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2000&auto=format',
    subtitle: 'Preview · Luxury Editions',
    heading: 'Curated Perfection',
    description: 'Discover timeless designs crafted to elevate your style with every detail.',
    cta: 'Shop Now',
  },
];

export interface BannerSlide {
  image: string;
  subtitle: string;
  heading: string;
  description: string;
  cta: string;
}

export const BannerAdmin = () => {
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    const saved = localStorage.getItem('tcv_hero_banners');
    return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
  });
  const [saved, setSaved] = useState(false);
  const [urlInputs, setUrlInputs] = useState<string[]>(banners.map(b => b.image));
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const save = (list: BannerSlide[]) => {
    localStorage.setItem('tcv_hero_banners', JSON.stringify(list));
    setBanners(list);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateField = (index: number, field: keyof BannerSlide, value: string) => {
    const list = banners.map((b, i) => i === index ? { ...b, [field]: value } : b);
    setBanners(list);
  };

  const applyUrl = (index: number) => {
    const url = urlInputs[index]?.trim();
    if (!url) return;
    const list = banners.map((b, i) => i === index ? { ...b, image: url } : b);
    setBanners(list);
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const list = banners.map((b, i) => i === index ? { ...b, image: base64 } : b);
      const newUrls = urlInputs.map((u, i) => i === index ? base64.slice(0, 60) + '...' : u);
      setBanners(list);
      setUrlInputs(newUrls);
    };
    reader.readAsDataURL(file);
  };

  const addBanner = () => {
    const newSlide: BannerSlide = {
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?q=80&w=2000',
      subtitle: 'New Collection',
      heading: 'New Banner',
      description: 'Add your description here.',
      cta: 'Shop Now',
    };
    setBanners([...banners, newSlide]);
    setUrlInputs([...urlInputs, newSlide.image]);
  };

  const removeBanner = (index: number) => {
    if (banners.length <= 1) return alert('At least one banner required.');
    setBanners(banners.filter((_, i) => i !== index));
    setUrlInputs(urlInputs.filter((_, i) => i !== index));
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

  return (
    <div className="text-[#1A1A1A]">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[24px] md:text-[28px] text-[#1A1A1A]">Hero Banner Manager</h1>
          <p className="text-[12px] text-gray-600 mt-1">Update hero slideshow images, text, and CTAs</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addBanner} className="border border-gray-300 bg-white text-[#1A1A1A] px-4 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-black hover:text-white transition-colors">
            <Plus size={13} />Add Slide
          </button>
          <button
            onClick={() => save(banners)}
            className={`px-5 py-2.5 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <Save size={13} />{saved ? 'Saved!' : 'Save Banners'}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {banners.map((banner, index) => (
          <div key={index} className="bg-white border border-gray-200 text-[#1A1A1A]">
            {/* Banner Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#F8F6F3] border-b border-gray-200 text-[#1A1A1A]">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#1A1A1A]">
                <Image size={14} className="text-gray-500" />
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
              {/* Image Preview */}
              <div>
                <div className="aspect-[3/2] bg-[#F8F6F3] overflow-hidden mb-3 border border-gray-200">
                  <img
                    src={banner.image}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Preview'; }}
                  />
                </div>

                {/* URL Input */}
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

                  {/* File Upload */}
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
                    className="w-full border border-gray-300 border-dashed text-[#1A1A1A] px-3 py-2.5 text-[11px] uppercase tracking-widest hover:bg-[#F8F6F3] transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={13} />Choose Image File
                  </button>
                </div>
              </div>

              {/* Text Fields */}
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
          className={`px-6 py-3 text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          <Save size={13} />{saved ? '✓ Saved Successfully!' : 'Save All Banners'}
        </button>
        <button
          onClick={() => {
            if (confirm('Reset to default banners?')) {
              setBanners(DEFAULT_BANNERS);
              setUrlInputs(DEFAULT_BANNERS.map(b => b.image));
              localStorage.removeItem('tcv_hero_banners');
            }
          }}
          className="border border-gray-300 text-[#1A1A1A] bg-white px-6 py-3 text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};
