import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollParallaxProps {
  children: ReactNode;
  speed?: number; // e.g. -0.2 to 0.2 (negative moves faster, positive moves slower)
  offset?: number; // max px offset
  direction?: 'vertical' | 'horizontal';
  className?: string;
  rotate?: number; // subtle rotation scrub
  scale?: [number, number]; // subtle scale range e.g. [0.96, 1.04]
}

export const ScrollParallax = ({
  children,
  speed = 0.15,
  offset = 40,
  direction = 'vertical',
  className = '',
  rotate,
  scale,
}: ScrollParallaxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const distance = offset * (speed * 10);
      const isVertical = direction === 'vertical';

      const fromProps: gsap.TweenVars = isVertical
        ? { y: -distance }
        : { x: -distance };

      const toProps: gsap.TweenVars = isVertical
        ? { y: distance }
        : { x: distance };

      if (rotate) {
        fromProps.rotation = -rotate;
        toProps.rotation = rotate;
      }

      if (scale) {
        fromProps.scale = scale[0];
        toProps.scale = scale[1];
      }

      toProps.ease = 'none';
      toProps.scrollTrigger = {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      };

      gsap.fromTo(target, fromProps, toProps);
    }, containerRef);

    return () => ctx.revert();
  }, [speed, offset, direction, rotate, scale]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={targetRef} className="w-full h-full will-change-transform">
        {children}
      </div>
    </div>
  );
};
