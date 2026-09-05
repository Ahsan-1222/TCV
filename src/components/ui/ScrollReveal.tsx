import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | '3d-flip';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.9,
  className = '',
  once = true,
}: ScrollRevealProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let fromVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = {
      opacity: 1,
      duration,
      delay,
      ease: 'power3.out',
    };

    switch (direction) {
      case 'down':
        fromVars = { opacity: 0, y: -45, rotateX: -10, transformPerspective: 1000 };
        toVars = { ...toVars, y: 0, rotateX: 0 };
        break;
      case 'left':
        fromVars = { opacity: 0, x: -50, rotateY: -12, transformPerspective: 1000 };
        toVars = { ...toVars, x: 0, rotateY: 0 };
        break;
      case 'right':
        fromVars = { opacity: 0, x: 50, rotateY: 12, transformPerspective: 1000 };
        toVars = { ...toVars, x: 0, rotateY: 0 };
        break;
      case 'zoom':
        fromVars = { opacity: 0, scale: 0.9, rotateX: 10, transformPerspective: 1000 };
        toVars = { ...toVars, scale: 1, rotateX: 0 };
        break;
      case '3d-flip':
        fromVars = { opacity: 0, rotateY: -25, scale: 0.92, transformPerspective: 1200 };
        toVars = { ...toVars, rotateY: 0, scale: 1, ease: 'back.out(1.2)' };
        break;
      case 'up':
      default:
        fromVars = { opacity: 0, y: 45, rotateX: 12, transformPerspective: 1000 };
        toVars = { ...toVars, y: 0, rotateX: 0 };
        break;
    }

    gsap.set(el, fromVars);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, toVars);
            if (once) observer.unobserve(el);
          } else if (!once) {
            gsap.to(el, { ...fromVars, duration: 0.4 });
          }
        });
      },
      { threshold: 0.12, rootMargin: '-30px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [direction, delay, duration, once]);

  return (
    <div ref={elRef} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};
