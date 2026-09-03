import { db, storage, collections } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { products as initialProducts } from '../data/products';
import type { Product } from '../types';
import type { BannerSlide } from '../pages/admin/BannerAdmin';

export interface CategoryBanner {
  slug: string;
  title: string;
  label: string;
  desc: string;
  image: string;
  count?: string;
  unit?: string;
  accent?: string;
}

export const DEFAULT_CATEGORY_BANNERS: CategoryBanner[] = [
  {
    title: 'Perfume',
    label: 'Signature Fragrances',
    desc: 'Long-lasting Extrait • Gift Box Ready',
    image: `/assets/products/${encodeURIComponent('WhatsApp Image 2026-07-17 at 8.30.52 PM (2).jpeg')}`,
    slug: 'perfume',
    count: '05',
    unit: 'Scents',
    accent: '#C9A86A',
  },
  {
    title: 'Bags',
    label: 'Ladies Collection',
    desc: 'Office Totes • Evening Clutches',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format',
    slug: 'bags',
    count: '12',
    unit: 'Designs',
    accent: '#1A1A1A',
  },
  {
    title: 'Watches',
    label: 'Luxury Timepieces',
    desc: 'Precision Craftsmanship • Sapphire Glass',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=900&auto=format',
    slug: 'watches',
    count: '08',
    unit: 'Designs',
    accent: '#C9A86A',
  },
];

export const DEFAULT_BANNERS: BannerSlide[] = [
  {
    image: '/assets/banners/hero-perfumes.jpg',
    subtitle: 'The Crown Vault · Signature Collection',
    heading: 'ROOH Fragrances',
    description: 'An opulent symphony of rare florals, warm cardamom, and aged amber. Crafted for an unforgettable luxury impression.',
    cta: 'Explore Fragrances',
    link: '/categories/perfume',
  },
  {
    image: '/assets/banners/hero-watches.jpg',
    subtitle: 'Precision · Luxury Timepieces',
    heading: 'Timeless Horology',
    description: 'Masterfully engineered timepieces featuring sapphire crystal, polished bezels, and enduring craftsmanship.',
    cta: 'Discover Watches',
    link: '/categories/watches',
  },
  {
    image: '/assets/banners/hero-bags.jpg',
    subtitle: 'Artisanal · Handcrafted Leather',
    heading: 'Signature Leather Goods',
    description: 'Elegantly structured totes and shoulder bags tailored in full-grain leather for the modern connoisseur.',
    cta: 'Shop Bags',
    link: '/categories/bags',
  },
];

const DELETED_PRODUCTS_KEY = 'tcv_deleted_product_ids_v1';

export const getDeletedProductIds = (): string[] => {
  try {
    const saved = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const markProductAsDeleted = async (productId: string) => {
  try {
    const ids = getDeletedProductIds();
    if (!ids.includes(productId)) {
      ids.push(productId);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids));
    }
    await setDoc(doc(db, 'metadata', 'deleted_products'), {
      ids,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed saving deleted product ID to metadata:', err);
  }
};

// Helper to seed initial products to Firestore if empty
const seedProductsIfEmpty = async () => {
  try {
    const deletedIds = getDeletedProductIds();
    let prodsToSeed = initialProducts.filter(p => !deletedIds.includes(p.id));
    try {
      const cached = localStorage.getItem('tcv_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          prodsToSeed = parsed.filter(p => !deletedIds.includes(p.id));
        }
      }
    } catch {}

    for (const prod of prodsToSeed) {
      await setDoc(doc(db, collections.products, prod.id), prod, { merge: true });
    }
  } catch (err) {
    console.error('Error seeding products to Firestore:', err);
  }
};

// Helper to seed initial banners to Firestore if empty
const seedBannersIfEmpty = async () => {
  try {
    await setDoc(doc(db, collections.banners, 'hero_banners'), {
      slides: DEFAULT_BANNERS,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error seeding banners to Firestore:', err);
  }
};

export const sortProductsBySequence = (list: Product[]): Product[] => {
  return [...list].sort((a, b) => {
    const orderA = typeof a.displayOrder === 'number' ? a.displayOrder : 9999;
    const orderB = typeof b.displayOrder === 'number' ? b.displayOrder : 9999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.name || '').localeCompare(b.name || '');
  });
};

const productSubscribers = new Set<(prods: Product[]) => void>();
let productsUnsubscribe: (() => void) | null = null;
let lastProductsState: Product[] | null = null;

/**
 * Real-time listener for Products collection in Firestore DB (Shared Singleton)
 */
export const subscribeProducts = (onUpdate: (products: Product[]) => void): (() => void) => {
  productSubscribers.add(onUpdate);
  if (lastProductsState) {
    onUpdate(lastProductsState);
  }

  if (!productsUnsubscribe) {
    let isSeeding = false;
    productsUnsubscribe = onSnapshot(
      collection(db, collections.products),
      (snapshot) => {
        const deletedIds = getDeletedProductIds();

        if (snapshot.empty && !isSeeding) {
          isSeeding = true;
          seedProductsIfEmpty();
          let fallback = initialProducts.filter(p => !deletedIds.includes(p.id));
          try {
            const cached = localStorage.getItem('tcv_products');
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                fallback = parsed.filter((p: Product) => !deletedIds.includes(p.id));
              }
            }
          } catch {}
          fallback = sortProductsBySequence(fallback);
          lastProductsState = fallback;
          productSubscribers.forEach(cb => cb(fallback));
          return;
        }

        const prods: Product[] = [];
        snapshot.forEach((docSnap) => {
          const item = { id: docSnap.id, ...docSnap.data() } as Product;
          if (!deletedIds.includes(item.id)) {
            prods.push(item);
          }
        });

        const sortedProds = sortProductsBySequence(prods);

        try {
          localStorage.setItem('tcv_products', JSON.stringify(sortedProds));
          localStorage.setItem('tcv_admin_products', JSON.stringify(sortedProds));
        } catch {}

        lastProductsState = sortedProds;
        productSubscribers.forEach(cb => cb(sortedProds));
      },
      (error) => {
        console.warn('Firestore products snapshot error, using fallback cache:', error);
        const deletedIds = getDeletedProductIds();
        let fallback = initialProducts.filter(p => !deletedIds.includes(p.id));
        try {
          const cached = localStorage.getItem('tcv_products');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              fallback = parsed.filter((p: Product) => !deletedIds.includes(p.id));
            }
          }
        } catch {}
        fallback = sortProductsBySequence(fallback);
        lastProductsState = fallback;
        productSubscribers.forEach(cb => cb(fallback));
      }
    );
  }

  return () => {
    productSubscribers.delete(onUpdate);
    if (productSubscribers.size === 0 && productsUnsubscribe) {
      productsUnsubscribe();
      productsUnsubscribe = null;
      lastProductsState = null;
    }
  };
};

/**
 * Save product sequence/order in bulk to Firestore DB and LocalStorage
 */
export const saveProductSequenceToDB = async (reorderedProducts: Product[]): Promise<void> => {
  const updatedList = reorderedProducts.map((prod, index) => ({
    ...prod,
    displayOrder: index + 1,
    updatedAt: new Date().toISOString(),
  }));

  try {
    localStorage.setItem('tcv_products', JSON.stringify(updatedList));
    localStorage.setItem('tcv_admin_products', JSON.stringify(updatedList));
  } catch (err) {
    console.warn('Failed to update local storage product sequence:', err);
  }

  // Update in Firestore
  for (const prod of updatedList) {
    await setDoc(doc(db, collections.products, prod.id), JSON.parse(JSON.stringify(prod)), { merge: true });
  }

  lastProductsState = updatedList;
  productSubscribers.forEach(cb => cb(updatedList));
};

/**
 * Save or update product dynamically in Firestore DB
 */
export const saveProductToDB = async (product: Product): Promise<void> => {
  const cleanProduct = JSON.parse(JSON.stringify(product));

  if (typeof cleanProduct.displayOrder !== 'number' || cleanProduct.displayOrder <= 0) {
    const currentList = lastProductsState || [];
    cleanProduct.displayOrder = currentList.length + 1;
  }
  
  // Unmark deleted if admin re-saves
  try {
    const deleted = getDeletedProductIds();
    if (deleted.includes(product.id)) {
      const updated = deleted.filter(id => id !== product.id);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(updated));
    }
  } catch {}

  try {
    const cached = localStorage.getItem('tcv_products');
    let list: Product[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(p => p.id === product.id);
    if (idx >= 0) list[idx] = cleanProduct;
    else list.push(cleanProduct);
    list = sortProductsBySequence(list);
    localStorage.setItem('tcv_products', JSON.stringify(list));
    localStorage.setItem('tcv_admin_products', JSON.stringify(list));
  } catch (err) {
    console.warn('Failed updating LocalStorage for product:', err);
  }

  await setDoc(doc(db, collections.products, product.id), cleanProduct);
};

/**
 * Permanently delete image from Firebase Storage if stored in Firebase
 */
export const deleteImageFile = async (imageUrl?: string): Promise<void> => {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (imageUrl.includes('firebasestorage.googleapis.com') || imageUrl.includes('storage.googleapis.com') || imageUrl.startsWith('gs://')) {
    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
      console.log('Permanently deleted image from Firebase Storage:', imageUrl);
    } catch (err) {
      console.warn('Firebase Storage image deletion note:', err);
    }
  }
};

/**
 * Delete product dynamically from Firestore DB
 */
export const deleteProductFromDB = async (productId: string): Promise<void> => {
  await markProductAsDeleted(productId);

  // Permanently delete associated product images from Firebase Storage
  try {
    const cached = localStorage.getItem('tcv_products');
    if (cached) {
      const list: Product[] = JSON.parse(cached);
      const target = list.find(p => p.id === productId);
      if (target && Array.isArray(target.images)) {
        for (const img of target.images) {
          if (img?.url) {
            await deleteImageFile(img.url);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Error deleting product images from Firebase storage:', err);
  }

  try {
    const cached = localStorage.getItem('tcv_products');
    if (cached) {
      let list: Product[] = JSON.parse(cached);
      list = list.filter(p => p.id !== productId);
      list = sortProductsBySequence(list);
      localStorage.setItem('tcv_products', JSON.stringify(list));
      localStorage.setItem('tcv_admin_products', JSON.stringify(list));
    }
  } catch (err) {
    console.warn('Failed updating LocalStorage for deleted product:', err);
  }

  await deleteDoc(doc(db, collections.products, productId));
};

/**
 * Real-time listener for Banner slides in Firestore DB
 */
export const subscribeBanners = (onUpdate: (banners: BannerSlide[]) => void): (() => void) => {
  let isSeeding = false;

  const unsubscribe = onSnapshot(
    doc(db, collections.banners, 'hero_banners'),
    (snapshot) => {
      if (!snapshot.exists() && !isSeeding) {
        isSeeding = true;
        seedBannersIfEmpty();
        onUpdate(DEFAULT_BANNERS);
        return;
      }

      const data = snapshot.data();
      if (data && Array.isArray(data.slides) && data.slides.length > 0) {
        const validSlides = data.slides.filter((s: any) => s && typeof s.image === 'string' && s.image.trim() !== '');
        if (validSlides.length > 0) {
          try {
            localStorage.setItem('tcv_hero_banners_v5', JSON.stringify(validSlides));
            localStorage.setItem('tcv_hero_banners', JSON.stringify(validSlides));
          } catch {}
          onUpdate(validSlides);
          return;
        }
      }

      onUpdate(DEFAULT_BANNERS);
    },
    (error) => {
      console.warn('Firestore banners snapshot error, using default or cached banners:', error);
      try {
        const cached = localStorage.getItem('tcv_hero_banners_v5') || localStorage.getItem('tcv_hero_banners');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdate(parsed);
            return;
          }
        }
      } catch {}
      onUpdate(DEFAULT_BANNERS);
    }
  );

  return unsubscribe;
};

/**
 * Save banners dynamically in Firestore DB
 */
export const saveBannersToDB = async (banners: BannerSlide[]): Promise<void> => {
  const cleanBanners = JSON.parse(JSON.stringify(banners));
  try {
    localStorage.setItem('tcv_hero_banners_v5', JSON.stringify(cleanBanners));
    localStorage.setItem('tcv_hero_banners', JSON.stringify(cleanBanners));
  } catch (err) {
    console.warn('Failed to set localStorage tcv_hero_banners:', err);
  }

  await setDoc(doc(db, collections.banners, 'hero_banners'), {
    slides: cleanBanners,
    updatedAt: new Date().toISOString(),
  });
};

// Helper to seed initial category banners to Firestore if empty
const seedCategoryBannersIfEmpty = async () => {
  try {
    let initialToSeed = DEFAULT_CATEGORY_BANNERS;
    try {
      const cached = localStorage.getItem('tcv_category_banners');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialToSeed = parsed;
        }
      }
    } catch {}

    await setDoc(doc(db, collections.banners, 'category_banners'), {
      slides: initialToSeed,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error seeding category banners to Firestore:', err);
  }
};

/**
 * Real-time listener for Category Banners (Shop By Category) in Firestore DB
 */
export const subscribeCategoryBanners = (onUpdate: (categories: CategoryBanner[]) => void): (() => void) => {
  let isSeeding = false;

  const unsubscribe = onSnapshot(
    doc(db, collections.banners, 'category_banners'),
    (snapshot) => {
      if (!snapshot.exists() && !isSeeding) {
        isSeeding = true;
        seedCategoryBannersIfEmpty();
        try {
          const cached = localStorage.getItem('tcv_category_banners');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              onUpdate(parsed);
              return;
            }
          }
        } catch {}
        onUpdate(DEFAULT_CATEGORY_BANNERS);
        return;
      }

      const data = snapshot.data();
      if (data && Array.isArray(data.slides) && data.slides.length > 0) {
        try {
          localStorage.setItem('tcv_category_banners', JSON.stringify(data.slides));
        } catch {}
        onUpdate(data.slides);
      } else {
        try {
          const cached = localStorage.getItem('tcv_category_banners');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              onUpdate(parsed);
              return;
            }
          }
        } catch {}
        onUpdate(DEFAULT_CATEGORY_BANNERS);
      }
    },
    (error) => {
      console.warn('Firestore category banners snapshot error, using fallback cache:', error);
      try {
        const cached = localStorage.getItem('tcv_category_banners');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdate(parsed);
            return;
          }
        }
      } catch {}
      onUpdate(DEFAULT_CATEGORY_BANNERS);
    }
  );

  return unsubscribe;
};

/**
 * Save Shop By Category banners dynamically in Firestore DB
 */
export const saveCategoryBannersToDB = async (categories: CategoryBanner[]): Promise<void> => {
  const cleanCategories = JSON.parse(JSON.stringify(categories));
  try {
    localStorage.setItem('tcv_category_banners', JSON.stringify(cleanCategories));
  } catch (err) {
    console.warn('Failed to set localStorage tcv_category_banners:', err);
  }

  await setDoc(doc(db, collections.banners, 'category_banners'), {
    slides: cleanCategories,
    updatedAt: new Date().toISOString(),
  });
};

/**
 * Compress & resize images in browser canvas before uploading/storing
 * Reduces multi-megabyte image files to ~50-100KB without losing sharp visual quality.
 */
export const compressImage = (
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml' || file.size < 80 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context creation failed'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      let dataUrl = canvas.toDataURL('image/webp', quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(dataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
};

/**
 * Upload an image file dynamically to Firebase Storage with Canvas-compressed Base64 fallback
 */
export const uploadImageFile = async (file: File, folder: string = 'uploads'): Promise<string> => {
  try {
    const filename = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (err) {
    console.warn('Firebase Storage upload failed or restricted, using canvas-compressed Data URL fallback:', err);
    try {
      const compressedDataUrl = await compressImage(file);
      return compressedDataUrl;
    } catch (compressErr) {
      console.error('Image compression error, using raw FileReader fallback:', compressErr);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }
  }
};

