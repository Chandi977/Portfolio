import { motion } from "motion/react";
import { memo, useMemo } from "react";

const Card = memo(function Card({ style, text, image, containerRef }) {
  // Memoize animation config for smoother dragging
  const dragConfig = useMemo(
    () => ({
      whileHover: { scale: 1.05 },
      drag: true,
      dragConstraints: containerRef,
      dragElastic: 0.5, // Reduced for smoother feel
      dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
    }),
    [containerRef],
  );

  // Memoize style with will-change for GPU acceleration
  const optimizedStyle = useMemo(
    () => ({
      ...style,
      willChange: "transform",
    }),
    [style],
  );

  return image && !text ? (
    <motion.img
      className="absolute w-15 cursor-grab"
      src={image}
      style={optimizedStyle}
      {...dragConfig}
      loading="lazy"
    />
  ) : (
    <motion.div
      className="absolute px-1 py-4 text-xl text-center rounded-full ring ring-gray-700 font-extralight bg-storm w-[12rem] cursor-grab"
      style={optimizedStyle}
      {...dragConfig}
    >
      {text}
    </motion.div>
  );
});

export default Card;
