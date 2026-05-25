import { memo, useRef, useEffect } from "react";
import { interpolate } from "../../hooks/useGSAPBeat";

const LINES = [
  ["Built", "from", "latency,"],
  ["version-control,", "and"],
  ["03:00", "AM", "commits."],
];

const FLAT = LINES.flat();

const CoordinateLock = ({ progress }) => {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  const trRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);
  const sideLineLeftRef = useRef(null);
  const sideLineRightRef = useRef(null);
  const finalLineRef = useRef(null);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const container = containerRef.current;
      if (!container) return;

      // Overall fade
      container.style.opacity = interpolate(p, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

      // Corner brackets converge
      const pos = interpolate(p, [0, 1], [0, 60]);
      const neg = interpolate(p, [0, 1], [0, -60]);

      if (tlRef.current) tlRef.current.style.transform = `translate(${pos}px, ${pos}px)`;
      if (trRef.current) trRef.current.style.transform = `translate(${neg}px, ${pos}px)`;
      if (blRef.current) blRef.current.style.transform = `translate(${pos}px, ${neg}px)`;
      if (brRef.current) brRef.current.style.transform = `translate(${neg}px, ${neg}px)`;

      // Side lines
      const sideW = `${interpolate(p, [0.05, 0.5], [0, 100])}%`;
      if (sideLineLeftRef.current) sideLineLeftRef.current.style.width = sideW;
      if (sideLineRightRef.current) sideLineRightRef.current.style.width = sideW;

      // Final hairline
      const finalScale = interpolate(p, [0.85, 1], [0, 1]);
      if (finalLineRef.current) finalLineRef.current.style.transform = `scaleX(${finalScale})`;
    });
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity: 0 }}
    >
      {/* Corner brackets */}
      <span ref={tlRef} className="absolute top-10 left-10 w-10 h-10 border-l-2 border-t-2 border-lavender/80" style={{ willChange: "transform" }} />
      <span ref={trRef} className="absolute top-10 right-10 w-10 h-10 border-r-2 border-t-2 border-lavender/80" style={{ willChange: "transform" }} />
      <span ref={blRef} className="absolute bottom-10 left-10 w-10 h-10 border-l-2 border-b-2 border-lavender/80" style={{ willChange: "transform" }} />
      <span ref={brRef} className="absolute bottom-10 right-10 w-10 h-10 border-r-2 border-b-2 border-lavender/80" style={{ willChange: "transform" }} />

      {/* Side coordinate readouts */}
      <div className="absolute left-12 bottom-12 font-mono-tight text-[10px] tracking-[0.28em] text-neutral-500">
        LAT 28.5355° N · LON 77.3910° E
      </div>
      <div className="absolute right-12 top-12 font-mono-tight text-[10px] tracking-[0.28em] text-neutral-500">
        SIG-LOCK · 1.000
      </div>

      {/* Pre-title meta strip with growing rule */}
      <div className="mb-10 flex items-center gap-4">
        <div className="relative h-px w-24 bg-white/10 overflow-hidden">
          <div
            ref={sideLineLeftRef}
            className="absolute inset-y-0 left-0 bg-lavender"
            style={{ width: "0%" }}
          />
        </div>
        <span className="font-mono-tight text-[10px] tracking-[0.5em] text-aqua/80 uppercase">
          Coordinate · Lock · 02.04
        </span>
        <div className="relative h-px w-24 bg-white/10 overflow-hidden">
          <div
            ref={sideLineRightRef}
            className="absolute inset-y-0 right-0 bg-aqua"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      {/* The sentence — stacked lines, per-word mask reveal */}
      <div className="px-6 max-w-5xl text-center font-display-tight text-3xl md:text-5xl lg:text-6xl leading-[1.08] text-white tracking-[-0.03em]">
        {LINES.map((line, lineIdx) => {
          const offset = LINES.slice(0, lineIdx).reduce((n, l) => n + l.length, 0);
          return (
            <div key={lineIdx} className="flex justify-center flex-wrap gap-x-[0.32em]">
              {line.map((word, wIdx) => {
                const globalIdx = offset + wIdx;
                return (
                  <RevealWord
                    key={`${lineIdx}-${wIdx}`}
                    word={word}
                    progress={progress}
                    index={globalIdx}
                    total={FLAT.length}
                    revealStart={0.05}
                    revealEnd={0.85}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Hairline that grows last */}
      <div className="mt-16 w-full max-w-3xl">
        <div
          ref={finalLineRef}
          className="hairline"
          style={{ transform: "scaleX(0)", transformOrigin: "center" }}
        />
        <div className="flex justify-between mt-3 font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          <span>END · TRANSMISSION 02</span>
          <span>↓ CHAPTER 03 — IDENTITY</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   RevealWord — each word sits behind a vertical mask bar
   that wipes left-to-right while the word itself slides up,
   and the accent bar collapses.
   ───────────────────────────────────────────────────────── */
const RevealWord = memo(function RevealWord({
  word,
  progress,
  index,
  total,
  revealStart,
  revealEnd,
}) {
  const wordRef = useRef(null);
  const maskRef = useRef(null);
  const barRef = useRef(null);

  const span = revealEnd - revealStart;
  const step = span / total;
  const a = revealStart + index * step;
  const b = a + step * 1.6;

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const wordEl = wordRef.current;
      const maskEl = maskRef.current;
      const barEl = barRef.current;
      if (!wordEl) return;

      // Word slides up and fades in
      const y = interpolate(p, [a, b], [110, 0]);
      const opacity = interpolate(p, [a, a + step * 0.25, b], [0, 1, 1]);
      wordEl.style.transform = `translateY(${y}%)`;
      wordEl.style.opacity = opacity;

      // Mask wipes right
      if (maskEl) {
        maskEl.style.left = `${interpolate(p, [a, b], [0, 101])}%`;
      }

      // Underline accent bar draws then collapses
      if (barEl) {
        barEl.style.width = `${interpolate(
          p,
          [a, a + step * 0.6, b, b + step * 0.3],
          [0, 100, 100, 0]
        )}%`;
        barEl.style.opacity = interpolate(
          p,
          [a, a + step * 0.4, b + step * 0.2],
          [0, 0.9, 0]
        );
      }
    });
  }, [progress, a, b, step]);

  return (
    <span className="relative inline-block align-bottom" style={{ paddingBottom: "0.18em" }}>
      <span className="relative inline-block overflow-hidden align-bottom">
        <span
          ref={wordRef}
          style={{ display: "inline-block", opacity: 0, willChange: "transform, opacity" }}
          className="will-change-transform"
        >
          {word}
        </span>
        {/* Wipe mask */}
        <span
          ref={maskRef}
          aria-hidden
          style={{ left: "0%" }}
          className="pointer-events-none absolute inset-y-0 right-0 bg-primary"
        />
      </span>
      {/* Accent underline */}
      <span
        ref={barRef}
        aria-hidden
        style={{ width: "0%", opacity: 0 }}
        className="absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-lavender via-aqua to-coral"
      />
    </span>
  );
});

export default memo(CoordinateLock);
