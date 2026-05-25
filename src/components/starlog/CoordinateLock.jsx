import { memo } from "react";
import { motion, useTransform } from "motion/react";

const LINES = [
  ["Built", "from", "latency,"],
  ["version-control,", "and"],
  ["03:00", "AM", "commits."],
];

const FLAT = LINES.flat();

const CoordinateLock = ({ progress }) => {
  const fade = useTransform(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);

  // Corner crosshairs converge from the edges to a small inner rectangle.
  const pos = useTransform(progress, [0, 1], [0, 60]);
  const neg = useTransform(progress, [0, 1], [0, -60]);

  // Reveal animation runs across the back half of the beat
  const revealStart = 0.05;
  const revealEnd = 0.85;

  // Side decorative lines drawing in
  const sideLine = useTransform(progress, [0.05, 0.5], ["0%", "100%"], { clamp: true });
  const finalLine = useTransform(progress, [0.85, 1], [0, 1], { clamp: true });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ opacity: fade }}
    >
      {/* Corner brackets — converge as progress rises */}
      <motion.span
        style={{ x: pos, y: pos }}
        className="absolute top-10 left-10 w-10 h-10 border-l-2 border-t-2 border-lavender/80"
      />
      <motion.span
        style={{ x: neg, y: pos }}
        className="absolute top-10 right-10 w-10 h-10 border-r-2 border-t-2 border-lavender/80"
      />
      <motion.span
        style={{ x: pos, y: neg }}
        className="absolute bottom-10 left-10 w-10 h-10 border-l-2 border-b-2 border-lavender/80"
      />
      <motion.span
        style={{ x: neg, y: neg }}
        className="absolute bottom-10 right-10 w-10 h-10 border-r-2 border-b-2 border-lavender/80"
      />

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
          <motion.div
            className="absolute inset-y-0 left-0 bg-lavender"
            style={{ width: sideLine }}
          />
        </div>
        <span className="font-mono-tight text-[10px] tracking-[0.5em] text-aqua/80 uppercase">
          Coordinate · Lock · 02.04
        </span>
        <div className="relative h-px w-24 bg-white/10 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 right-0 bg-aqua"
            style={{ width: sideLine }}
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
                    revealStart={revealStart}
                    revealEnd={revealEnd}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Hairline that grows last and becomes the chapter divider */}
      <div className="mt-16 w-full max-w-3xl">
        <motion.div
          style={{ scaleX: finalLine, transformOrigin: "center" }}
          className="hairline"
        />
        <div className="flex justify-between mt-3 font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          <span>END · TRANSMISSION 02</span>
          <span>↓ CHAPTER 03 — IDENTITY</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   RevealWord — each word sits behind a vertical mask bar
   that wipes left-to-right while the word itself slides up,
   un-blurs and the accent bar collapses. The combined effect
   feels like a glyph snapping into a frame.
   ───────────────────────────────────────────────────────── */
const RevealWord = memo(function RevealWord({
  word,
  progress,
  index,
  total,
  revealStart,
  revealEnd,
}) {
  const span = revealEnd - revealStart;
  const step = span / total;
  const a = revealStart + index * step;
  const b = a + step * 1.6; // slight overlap

  const maskX = useTransform(progress, [a, b], ["0%", "101%"], { clamp: true });
  const y = useTransform(progress, [a, b], ["110%", "0%"], { clamp: true });
  const opacity = useTransform(progress, [a, a + step * 0.25, b], [0, 1, 1], { clamp: true });
  const blur = useTransform(progress, [a, b], [6, 0], { clamp: true });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  // Underline accent bar that draws then collapses
  const barWidth = useTransform(
    progress,
    [a, a + step * 0.6, b, b + step * 0.3],
    ["0%", "100%", "100%", "0%"],
    { clamp: true },
  );
  const barOpacity = useTransform(
    progress,
    [a, a + step * 0.4, b + step * 0.2],
    [0, 0.9, 0],
    { clamp: true },
  );

  return (
    <span className="relative inline-block align-bottom" style={{ paddingBottom: "0.18em" }}>
      <span className="relative inline-block overflow-hidden align-bottom">
        <motion.span
          style={{ y, opacity, filter, display: "inline-block" }}
          className="will-change-transform"
        >
          {word}
        </motion.span>
        {/* Wipe mask — sits on top of the glyph and recedes right */}
        <motion.span
          aria-hidden
          style={{ left: maskX }}
          className="pointer-events-none absolute inset-y-0 right-0 bg-primary"
        />
      </span>
      {/* Accent underline — sweeps and collapses */}
      <motion.span
        aria-hidden
        style={{ width: barWidth, opacity: barOpacity }}
        className="absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-lavender via-aqua to-coral"
      />
    </span>
  );
});

export default memo(CoordinateLock);
