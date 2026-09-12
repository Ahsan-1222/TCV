import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type ScrollRevealDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'zoom'
  | 'blur'
  | '3d-flip'
  | 'none';

export interface ScrollRevealProps {
  children: ReactNode;
  direction?: ScrollRevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  start?: string;
  end?: string;
  stagger?: number;
  staggerSelector?: string;
  parallaxY?: number;
  scrub?: boolean | number;
  scale?: number;
  blur?: boolean;
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.85,
  distance = 32,
  className = '',
  once = true,
  start = 'top 88%',
  end = 'bottom 15%',
  stagger,
  staggerSelector,
  parallaxY,
  scrub,
  scale,
  blur = false,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // Determine target elements (either container or staggered children)
      const targets = staggerSelector
        ? el.querySelectorAll(staggerSelector)
        : stagger && el.children.length > 0
        ? Array.from(el.children)
        : el;

      // Base initial vars
      const fromVars: gsap.TweenVars = {
        opacity: 0,
      };

      if (blur) {
        fromVars.filter = 'blur(10px)';
      }

      switch (direction) {
        case 'down':
          fromVars.y = -distance;
          break;
        case 'left':
          fromVars.x = -distance;
          break;
        case 'right':
          fromVars.x = distance;
          break;
        case 'zoom':
          fromVars.scale = scale ?? 0.94;
          fromVars.transformOrigin = 'center center';
          break;
        case 'blur':
          fromVars.y = distance * 0.5;
          fromVars.filter = 'blur(12px)';
          break;
        case '3d-flip':
          fromVars.rotateX = 8;
          fromVars.y = distance * 0.7;
          fromVars.transformPerspective = 1000;
          break;
        case 'none':
          break;
        case 'up':
        default:
          fromVars.y = distance;
          if (scale) fromVars.scale = scale;
          break;
      }

      const toVars: gsap.TweenVars = {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration,
        delay,
        ease: 'power3.out',
        clearProps: 'transform,filter',
      };

      if (blur || direction === 'blur') {
        toVars.filter = 'blur(0px)';
      }

      if (stagger && (staggerSelector || el.children.length > 0)) {
        toVars.stagger = stagger;
      }

      // If parallax is requested with scrub
      if (parallaxY !== undefined || scrub !== undefined) {
        gsap.fromTo(
          targets,
          { y: parallaxY ? -parallaxY : 0 },
          {
            y: parallaxY ? parallaxY : 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: scrub ?? 1,
            },
          }
        );
      } else {
        // Standard entrance animation with ScrollTrigger
        toVars.scrollTrigger = {
          trigger: el,
          start,
          end,
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          invalidateOnRefresh: true,
        };

        gsap.fromTo(targets, fromVars, toVars);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [
    direction,
    delay,
    duration,
    distance,
    once,
    start,
    end,
    stagger,
    staggerSelector,
    parallaxY,
    scrub,
    scale,
    blur,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};
