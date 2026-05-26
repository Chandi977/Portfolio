/* eslint-disable react/prop-types */
"use client";

import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useCallback, memo } from "react";

import { twMerge } from "tailwind-merge";

const MOVEMENT_DAMPING = 1400;

// Default config tuned for the ORIGIN beat. Colors are intentionally tinted
// toward the starlog palette (lavender base, aqua glow) instead of pure white.
const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    2,
  ),
  phi: 0,
  theta: 0.28,
  dark: 1,
  diffuse: 1.05,
  mapSamples: 12000,
  mapBrightness: 5.4,
  baseColor: [0.32, 0.27, 0.55], // lavender land
  markerColor: [0.92, 0.32, 0.55], // coral pins
  glowColor: [0.2, 0.76, 0.8], // aqua atmosphere
  markers: [
    { location: [28.5355, 77.391], size: 0.12 }, // Noida - origin (largest)
    { location: [28.6139, 77.209], size: 0.07 }, // Delhi
    { location: [19.076, 72.8777], size: 0.065 }, // Mumbai
    { location: [12.9716, 77.5946], size: 0.06 }, // Bengaluru
    { location: [13.0827, 80.2707], size: 0.055 }, // Chennai
    { location: [22.5726, 88.3639], size: 0.055 }, // Kolkata
    { location: [17.385, 78.4867], size: 0.05 }, // Hyderabad
    { location: [23.0225, 72.5714], size: 0.05 }, // Ahmedabad
    { location: [18.5204, 73.8567], size: 0.045 }, // Pune
    { location: [26.9124, 75.7873], size: 0.045 }, // Jaipur
  ],
};

export const Globe = memo(function Globe({
  className,
  config = GLOBE_CONFIG,
  autoRotateSpeed = 0.0035,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const widthRef = useRef(0);
  const phiRef = useRef(0);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const globeRef = useRef(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = useCallback((value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  }, []);

  const updateMovement = useCallback(
    (clientX) => {
      if (pointerInteracting.current !== null) {
        const delta = clientX - pointerInteracting.current;
        pointerInteractionMovement.current = delta;
        r.set(r.get() + delta / MOVEMENT_DAMPING);
      }
    },
    [r],
  );

  useEffect(() => {
    let resizeTimeout;
    let resizeObs;
    const pixelRatio = config.devicePixelRatio || 1;
    const renderSize = () => Math.round(widthRef.current * pixelRatio);

    const measure = () => {
      // Use the wrapping container to size the globe — guarantees the canvas
      // fills its parent regardless of CSS sizing classes elsewhere.
      const host = containerRef.current;
      if (!host) return;
      const next = host.offsetWidth;
      if (next) widthRef.current = next;
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measure, 80);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    measure();

    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObs = new ResizeObserver(debouncedResize);
      resizeObs.observe(containerRef.current);
    }

    globeRef.current = createGlobe(canvasRef.current, {
      ...config,
      width: renderSize(),
      height: renderSize(),
      onRender: (state) => {
        if (!pointerInteracting.current) phiRef.current += autoRotateSpeed;
        state.phi = phiRef.current + rs.get();
        state.width = renderSize();
        state.height = renderSize();
      },
    });

    requestAnimationFrame(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    });

    return () => {
      clearTimeout(resizeTimeout);
      if (resizeObs) resizeObs.disconnect();
      if (globeRef.current) {
        globeRef.current.destroy();
      }
      window.removeEventListener("resize", debouncedResize);
    };
  }, [rs, config, autoRotateSpeed]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative mx-auto aspect-square w-full overflow-hidden",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        style={{
          // Lock the canvas's display size to its container regardless of
          // its intrinsic width/height attributes. cobe sets those to
          // width*2 for HiDPI; without an explicit display size, the
          // intrinsic size can leak into layout and overflow the parent.
          display: "block",
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          opacity: 0,
          transition: "opacity 700ms",
          willChange: "opacity",
        }}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
});
