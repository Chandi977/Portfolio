import { memo, useRef, useEffect, useCallback } from "react";
import OrbitalDial from "../components/starlog/OrbitalDial";
import Telemetry from "../components/starlog/Telemetry";
import WordMorph from "../components/starlog/WordMorph";
import MarqueeStrip from "../components/starlog/MarqueeStrip";
import CoordinateLock from "../components/starlog/CoordinateLock";
import {
  PinnedStage,
  Beat,
  useSubProgress,
  useProgressStyle,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

/**
 * STARLOG // TRANSMISSION 02
 * A pinned scrollytelling chapter. One sticky viewport, four beats:
 *   1) BOOT          0.00 → 0.10
 *   2) ORBITAL       0.10 → 0.42
 *   3) MORPH         0.42 → 0.72
 *   4) COORD-LOCK    0.72 → 1.00
 *
 * Lenis drives window.scrollY; GSAP ScrollTrigger (inside PinnedStage)
 * tracks the container and feeds a progress object to all children.
 */

const Starlog = () => {
  return (
    <PinnedStage
      id="starlog"
      index="02"
      callsign="CHANGELOG"
      tone="lavender"
      height={420}
      beatLabels={["BOOT", "ORBITAL", "MORPH", "LOCK"]}
      hideHeader={false}
    >
      {(p) => <StarlogBeats p={p} />}
    </PinnedStage>
  );
};

const StarlogBeats = memo(function StarlogBeats({ p }) {
  // Per-beat local progress, remapped to [0,1] for clean component logic.
  // Sub-progress ranges end well before each beat's fade-out so content has
  // dwell time on screen before transitioning out.
  const bootP = useSubProgress(p, 0.00, 0.08);
  const orbitalP = useSubProgress(p, 0.10, 0.38);
  const morphP = useSubProgress(p, 0.44, 0.66);
  const lockP = useSubProgress(p, 0.72, 0.94);

  return (
    <>
      {/* ============ BEAT 1 — BOOT ============ */}
      <Beat progress={p} range={[0, 0, 0.09, 0.13]}>
        <BootBeat progress={bootP} />
      </Beat>

      {/* ============ BEAT 2 — ORBITAL DIAL ============ */}
      <Beat progress={p} range={[0.09, 0.13, 0.42, 0.46]}>
        <OrbitalDial progress={orbitalP} />
        <Telemetry progress={orbitalP} />
      </Beat>

      {/* ============ BEAT 3 — WORD MORPH ============ */}
      <Beat progress={p} range={[0.42, 0.46, 0.72, 0.76]}>
        <WordMorph progress={morphP} />
        <MarqueeStrip progress={morphP} direction={1} />
        <MarqueeStrip progress={morphP} direction={-1} top />
      </Beat>

      {/* ============ BEAT 4 — COORDINATE LOCK ============ */}
      <Beat progress={p} range={[0.72, 0.76, 0.98, 1.00]}>
        <CoordinateLock progress={lockP} />
      </Beat>
    </>
  );
});

/* ── Boot beat content ─────────────────────────────────────── */
const BootBeat = memo(function BootBeat({ progress }) {
  const groupRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const typeRef = useRef(null);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const group = groupRef.current;
      const ring = ringRef.current;
      const label = labelRef.current;
      const typeEl = typeRef.current;
      if (!group || !ring || !label || !typeEl) return;

      // Boot group stays fully visible — outer Beat handles fade-out.
      group.style.opacity = 1;

      // Ring scale + opacity
      const ringScale = interpolate(p, [0, 1], [0, 8]);
      const ringOpacity = interpolate(p, [0, 0.4, 1], [0, 0.6, 0]);
      ring.style.transform = `scale(${ringScale})`;
      ring.style.opacity = ringOpacity;

      // Label opacity — fade in only, hold at peak
      label.style.opacity = interpolate(p, [0, 0.2], [0, 1]);

      // Type-writer width — completes a touch earlier to give it dwell time
      typeEl.style.width = `${interpolate(p, [0.1, 0.85], [0, 100])}%`;
    });
  }, [progress]);

  return (
    <div
      ref={groupRef}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* Bloom ring */}
      <div
        ref={ringRef}
        className="rounded-full border border-lavender/70"
        style={{ width: 24, height: 24, opacity: 0, willChange: "transform, opacity" }}
      />
      {/* Central glyph */}
      <div className="absolute flex flex-col items-center gap-6">
        <div className="relative w-3 h-3">
          <span className="absolute inset-0 bg-lavender rounded-full" />
          <span className="absolute -inset-2 border border-lavender/40 rounded-full" />
        </div>
        <div
          ref={labelRef}
          style={{ opacity: 0 }}
          className="font-mono-tight text-[10px] tracking-[0.45em] text-neutral-400 flex items-center gap-3"
        >
          <span>::ENV</span>
          <span className="block w-12 h-px bg-neutral-700" />
          <span>28.54°N · 77.39°E</span>
        </div>
        <div
          style={{ opacity: 0 }}
          ref={labelRef}
          className="font-mono-tight text-[11px] text-aqua/90 overflow-hidden whitespace-nowrap"
        >
          <span
            ref={typeRef}
            style={{ display: "inline-block", width: "0%", overflow: "hidden" }}
          >
            booting&nbsp;runtime…&nbsp;handshake&nbsp;ok&nbsp;·&nbsp;mounting&nbsp;modules
          </span>
          <span className="starlog-cursor text-aqua/90" />
        </div>
      </div>
    </div>
  );
});

export default memo(Starlog);
