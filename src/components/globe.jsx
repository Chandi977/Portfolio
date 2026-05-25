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
  devicePixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
  phi: 0,
  theta: 0.28,
  dark: 1,
  diffuse: 1.05,
  mapSamples: 12000,
  mapBrightness: 5.4,
  baseColor: [0.32, 0.27, 0.55],   // lavender land
  markerColor: [0.92, 0.32, 0.55], // coral pins
  glowColor: [0.20, 0.76, 0.80],   // aqua atmosphere
  markers: [
    { location: [28.5355, 77.391], size: 0.12 }, // Noida - origin (largest)
    { location: [19.076, 72.8777], size: 0.05 },  // Mumbai
    { location: [28.6139, 77.209], size: 0.05 },  // Delhi
    { location: [40.7128, -74.006], size: 0.045 },// NYC
    { location: [51.5074, -0.1278], size: 0.045 },// London
    { location: [35.6762, 139.6503], size: 0.045},// Tokyo
    { location: [-33.8688, 151.2093], size: 0.04},// Sydney
    { location: [37.7749, -122.4194], size: 0.04},// SF
    { location: [1.3521, 103.8198], size: 0.035 },// Singapore
    { location: [25.2048, 55.2708], size: 0.035 },// Dubai
  ],
};

export const Globe = memo(function Globe({
  className,
  config = GLOBE_CONFIG,
  autoRotateSpeed = 0.0035,
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
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

    const measure = () => {
      // Use the wrapping container to size the globe — guarantees the canvas
      // fills its parent regardless of CSS sizing classes elsewhere.
      const host = containerRef.current;
      if (!host) return;
      const next = host.offsetWidth;
      if (next && next !== width) {
        width = next;
        // Resync immediately so the globe doesn't appear cropped on resize.
        if (globeRef.current && canvasRef.current) {
          canvasRef.current.width = width * 2;
          canvasRef.current.height = width * 2;
        }
      }
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
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += autoRotateSpeed;
        state.phi = phi + rs.get();
        state.width = width * 2;
        state.height = width * 2;
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
        "relative mx-auto aspect-square w-full",
        className,
      )}
    >
      <canvas
        className="w-full h-full opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
        ref={canvasRef}
        style={{ willChange: "opacity" }}
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
