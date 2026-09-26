import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initMetaPixel, trackPageView } from '../../services/metaPixel';

export const MetaPixelTracker = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    initMetaPixel();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
};

