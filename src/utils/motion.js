// Memoization cache for animation variants
const variantCache = new Map();

// Helper to create cached variants
const createCachedVariant = (key, factory) => {
  if (!variantCache.has(key)) {
    variantCache.set(key, factory());
  }
  return variantCache.get(key);
};

// Optimized spring config for smoother animations
const optimizedSpring = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
};

export const textVariant = (delay = 0) => {
  const key = `text-${delay}`;
  return createCachedVariant(key, () => ({
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        ...optimizedSpring,
        duration: 1.25,
        delay,
      },
    },
  }));
};

export const fadeIn = (
  direction = "",
  type = "tween",
  delay = 0,
  duration = 0.5,
) => {
  const key = `fadeIn-${direction}-${type}-${delay}-${duration}`;
  return createCachedVariant(key, () => ({
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type,
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out curve
      },
    },
  }));
};

export const zoomIn = (delay = 0, duration = 0.5) => {
  const key = `zoomIn-${delay}-${duration}`;
  return createCachedVariant(key, () => ({
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }));
};

export const slideIn = (
  direction = "",
  type = "tween",
  delay = 0,
  duration = 0.5,
) => {
  const key = `slideIn-${direction}-${type}-${delay}-${duration}`;
  return createCachedVariant(key, () => ({
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }));
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => {
  const key = `stagger-${staggerChildren}-${delayChildren}`;
  return createCachedVariant(key, () => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  }));
};

// New utility: Reduced motion variant for accessibility
export const reducedMotionVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

// New utility: Clear cache (useful for memory management)
export const clearVariantCache = () => variantCache.clear();
