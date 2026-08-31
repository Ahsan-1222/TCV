import { useEffect, useState } from 'react';
import { subscribeCategoryBanners, DEFAULT_CATEGORY_BANNERS, type CategoryBanner } from '../services/dbService';

export const useCategoryBanners = () => {
  const [categories, setCategories] = useState<CategoryBanner[]>(() => {
    try {
      const saved = localStorage.getItem('tcv_category_banners');
      if (saved) {
        const parsed = JSON.parse(saved) as CategoryBanner[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CATEGORY_BANNERS;
  });

  useEffect(() => {
    const unsubscribe = subscribeCategoryBanners((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });

    return () => unsubscribe();
  }, []);

  return categories;
};
