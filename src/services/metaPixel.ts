// Meta (Facebook / Instagram) Pixel Integration Service

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

/**
 * Initializes Meta Pixel snippet dynamically if Pixel ID is configured
 */
export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;

  const pixelId = META_PIXEL_ID;
  if (!pixelId) {
    console.info('[Meta Pixel] No VITE_META_PIXEL_ID set. Pixel tracking will run in safe stub mode.');
  }

  if (window.fbq) return;

  const fbq: any = function (...args: any[]) {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  };

  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];

  window.fbq = fbq;

  // Insert script tag
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  if (pixelId && window.fbq) {
    window.fbq('init', pixelId);
  }
};

/**
 * Track generic or custom Meta Pixel event
 */
export const trackMetaEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (data) {
        window.fbq('track', eventName, data);
      } else {
        window.fbq('track', eventName);
      }
    } catch (err) {
      console.warn(`[Meta Pixel] Error tracking event ${eventName}:`, err);
    }
  }
};

/**
 * Track PageView event
 */
export const trackPageView = () => {
  trackMetaEvent('PageView');
};

/**
 * Track ViewContent event (Product Detail view)
 */
export const trackViewContent = (product: { id: string; name: string; category?: string; price: number }) => {
  trackMetaEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category || 'General',
    value: product.price,
    currency: 'PKR',
  });
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (product: { id: string; name: string; category?: string; price: number }, quantity = 1) => {
  trackMetaEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'PKR',
  });
};

/**
 * Track InitiateCheckout event
 */
export const trackInitiateCheckout = (items: Array<{ product: { id: string; name: string; price: number }; quantity: number }>, total: number) => {
  trackMetaEvent('InitiateCheckout', {
    content_ids: items.map(i => i.product.id),
    num_items: items.reduce((acc, i) => acc + (i.quantity || 1), 0),
    value: total,
    currency: 'PKR',
  });
};

/**
 * Track Purchase event
 */
export const trackPurchase = (
  orderId: string,
  total: number,
  items: Array<{ product: { id: string; name: string; price: number }; quantity: number }>
) => {
  trackMetaEvent('Purchase', {
    content_ids: items.map(i => i.product.id),
    value: total,
    currency: 'PKR',
    order_id: orderId,
    num_items: items.reduce((acc, i) => acc + (i.quantity || 1), 0),
  });
};

/**
 * Track Search event
 */
export const trackSearch = (searchQuery: string) => {
  if (!searchQuery.trim()) return;
  trackMetaEvent('Search', {
    search_string: searchQuery,
  });
};
