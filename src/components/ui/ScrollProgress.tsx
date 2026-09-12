import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.0005,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <motion.div
        style={{ scaleX }}
        className="h-[2.5px] bg-gradient-to-r from-[#8C6D38] via-[#C9A86A] to-[#FFF3D1] origin-left shadow-[0_0_15px_rgba(201,168,106,0.85)]"
      />
    </div>
  );
};
