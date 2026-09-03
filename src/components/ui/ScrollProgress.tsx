import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C9A86A] via-[#FFF3D1] to-[#C9A86A] z-50 origin-left shadow-[0_0_12px_rgba(201,168,106,0.8)] pointer-events-none"
    />
  );
};
