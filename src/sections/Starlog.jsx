import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import OrbitalDial from "../components/starlog/OrbitalDial";
import Telemetry from "../components/starlog/Telemetry";
import WordMorph from "../components/starlog/WordMorph";
import MarqueeStrip from "../components/starlog/MarqueeStrip";
import CoordinateLock from "../components/starlog/CoordinateLock";

/**
 * STARLOG // TRANSMISSION 02
 * A pinned scrollytelling chapter. One sticky viewport, four beats:
 *   1) BOOT          0.00 → 0.10
 *   2) ORBITAL       0.10 → 0.42
 *   3) MORPH         0.42 → 0.72
 *   4) COORD-LOCK    0.72 → 1.00
 *
 * Lenis drives window.scrollY so useScroll/useTransform and the
 * GSAP ScrollTrigger inside CoordinateLock stay locked together.
 */

const Starlog = () => {
  const containerRef = useRef(null);

  // The container is 420vh tall; the inner sticky panel is 100vh.
  // Scroll progress 0 → 1 over the full 420vh, while the panel stays pinned.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Per-beat local progress, remapped to [0,1] for clean component logic.
  const bootP = useTransform(scrollYProgress, [0.00, 0.10], [0, 1], { clamp: true });
  const orbitalP = useTransform(scrollYProgress, [0.08, 0.46], [0, 1], { clamp: true });
  const morphP = useTransform(scrollYProgress, [0.42, 0.74], [0, 1], { clamp: true });
  const lockP = useTransform(scrollYProgress, [0.70, 1.00], [0, 1], { clamp: true });

  // Background washes that respond to the whole chapter
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const radialOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.45, 0.7, 0.55, 0.3],
  );

  // BOOT beat values
  const bootRingScale = useTransform(bootP, [0, 1], [0, 8]);
  const bootRingOpacity = useTransform(bootP, [0, 0.4, 1], [0, 0.6, 0]);
  const bootLabelOpacity = useTransform(bootP, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  const bootTypeWidth = useTransform(bootP, [0.1, 0.9], ["0%", "100%"]);
  const bootGroupOpacity = useTransform(bootP, [0, 0.7, 1], [1, 1, 0]);

  // Progress-rail width
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="starlog"
      ref={containerRef}
      aria-label="Starlog — Transmission 02"
      className="relative"
      // Full-bleed: break out of the parent container's max-width so the
      // sticky panel can use the entire viewport.
      style={{ height: "420vh", width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {/* Sticky stage — the entire visual lives inside this one viewport */}
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {/* Atmosphere layers */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(122,87,219,0.18) 0%, rgba(3,4,18,0) 65%), radial-gradient(40% 40% at 80% 20%, rgba(51,194,204,0.10) 0%, rgba(3,4,18,0) 60%), radial-gradient(35% 35% at 15% 85%, rgba(234,72,132,0.08) 0%, rgba(3,4,18,0) 60%)",
            y: bgY,
            opacity: radialOpacity,
          }}
        />
        <div className="starlog-scanlines" aria-hidden />
        <div className="starlog-grain" aria-hidden />

        {/* Registration marks in each corner — keep the "atlas" frame */}
        <span className="reg-mark" style={{ top: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ top: 24, right: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, right: 24 }} aria-hidden />

        {/* Persistent header tag */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono-tight text-[10px] tracking-[0.5em] text-neutral-500 z-30">
          <span className="block w-6 h-px bg-lavender/60" />
          STARLOG · TRANSMISSION 02
          <span className="block w-6 h-px bg-aqua/60" />
        </div>

        {/* Chapter progress rail (bottom of viewport) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] z-30">
          <div className="flex justify-between font-mono-tight text-[9px] tracking-[0.35em] text-neutral-500 mb-2">
            <span>00</span>
            <span>BOOT · ORBITAL · MORPH · LOCK</span>
            <span>01</span>
          </div>
          <div className="h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-coral"
              style={{ width: railWidth }}
            />
          </div>
        </div>

        {/* ============ BEAT 1 — BOOT ============ */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: bootGroupOpacity }}
        >
          {/* Bloom ring */}
          <motion.div
            className="rounded-full border border-lavender/70"
            style={{
              width: 24,
              height: 24,
              scale: bootRingScale,
              opacity: bootRingOpacity,
            }}
          />
          {/* Central glyph */}
          <div className="absolute flex flex-col items-center gap-6">
            <div className="relative w-3 h-3">
              <span className="absolute inset-0 bg-lavender rounded-full" />
              <span className="absolute -inset-2 border border-lavender/40 rounded-full" />
            </div>
            <motion.div
              style={{ opacity: bootLabelOpacity }}
              className="font-mono-tight text-[10px] tracking-[0.45em] text-neutral-400 flex items-center gap-3"
            >
              <span>::SIGNAL</span>
              <span className="block w-12 h-px bg-neutral-700" />
              <span>28.54°N · 77.39°E</span>
            </motion.div>
            <motion.div
              style={{ opacity: bootLabelOpacity }}
              className="font-mono-tight text-[11px] text-aqua/90 overflow-hidden whitespace-nowrap"
            >
              <motion.span style={{ display: "inline-block", width: bootTypeWidth, overflow: "hidden" }}>
                establishing&nbsp;link…&nbsp;handshake&nbsp;ok&nbsp;·&nbsp;routing&nbsp;through&nbsp;orbit
              </motion.span>
              <span className="starlog-cursor text-aqua/90" />
            </motion.div>
          </div>
        </motion.div>

        {/* ============ BEAT 2 — ORBITAL DIAL ============ */}
        <OrbitalDial progress={orbitalP} />
        <Telemetry progress={orbitalP} />

        {/* ============ BEAT 3 — WORD MORPH ============ */}
        <WordMorph progress={morphP} />
        <MarqueeStrip progress={morphP} direction={1} />
        <MarqueeStrip progress={morphP} direction={-1} top />

        {/* ============ BEAT 4 — COORDINATE LOCK ============ */}
        <CoordinateLock progress={lockP} triggerRef={containerRef} />
      </div>
    </section>
  );
};

export default memo(Starlog);
