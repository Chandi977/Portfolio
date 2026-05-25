import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { memo, useMemo } from "react";

const ParallaxBackground = memo(function ParallaxBackground() {
  const { scrollYProgress } = useScroll();

  // Optimized spring config for smoother parallax
  const springConfig = useMemo(
    () => ({
      damping: 50,
      stiffness: 100,
      mass: 0.5,
    }),
    [],
  );

  const x = useSpring(scrollYProgress, springConfig);
  const mountain3Y = useTransform(x, [0, 0.5], ["0%", "70%"]);
  const planetsX = useTransform(x, [0, 0.5], ["0%", "-20%"]);
  const mountain2Y = useTransform(x, [0, 0.5], ["0%", "30%"]);
  const mountain1Y = useTransform(x, [0, 0.5], ["0%", "0%"]);

  // Memoized styles for GPU-accelerated transforms
  const baseStyle = useMemo(
    () => ({
      backgroundPosition: "bottom",
      backgroundSize: "cover",
      willChange: "transform",
    }),
    [],
  );

  return (
    <section className="pointer-events-none absolute inset-0 bg-black/40">
      <div className="relative h-full overflow-hidden">
        {/* Background Sky - Static, no animation needed */}
        <div
          className="absolute inset-0 h-full w-full -z-50"
          style={{
            backgroundImage: "url(/assets/sky.jpg)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />
        {/* Mountain Layer 3 */}
        <motion.div
          className="absolute inset-0 -z-40"
          style={{
            backgroundImage: "url(/assets/mountain-3.png)",
            ...baseStyle,
            y: mountain3Y,
          }}
        />
        {/* Planets */}
        <motion.div
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: "url(/assets/planets.png)",
            ...baseStyle,
            x: planetsX,
          }}
        />
        {/* Mountain Layer 2 */}
        <motion.div
          className="absolute inset-0 -z-20"
          style={{
            backgroundImage: "url(/assets/mountain-2.png)",
            ...baseStyle,
            y: mountain2Y,
          }}
        />
        {/* Mountain Layer 1 */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(/assets/mountain-1.png)",
            ...baseStyle,
            y: mountain1Y,
          }}
        />
      </div>
    </section>
  );
});

export default ParallaxBackground;
