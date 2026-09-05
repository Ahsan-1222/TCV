import { useEffect, useState } from 'react';
import { subscribeBanners, DEFAULT_BANNERS } from '../services/dbService';
import type { BannerSlide } from '../pages/admin/BannerAdmin';

const BANNER_CACHE_KEY = 'tcv_hero_banners_v6';

export const useBanners = () => {
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem(BANNER_CACHE_KEY) || localStorage.getItem('tcv_hero_banners_v5') || localStorage.getItem('tcv_hero_banners');
      if (saved) {
        const parsed = JSON.parse(saved) as BannerSlide[];
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(s => typeof s?.image === 'string')) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_BANNERS;
  });

  useEffect(() => {
    const unsubscribe = subscribeBanners((slides) => {
      if (slides && slides.length > 0) {
        try {
          localStorage.setItem(BANNER_CACHE_KEY, JSON.stringify(slides));
        } catch {}
        setBanners(slides);
      }
    });

    return () => unsubscribe();
  }, []);

  return banners;
};
