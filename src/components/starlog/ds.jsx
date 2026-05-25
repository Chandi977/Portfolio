import { memo, useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useSpring } from "motion/react";

/* ============================================================
   STARLOG · Design-System primitives
   Every chapter composes from these.
   ============================================================ */

/** Tiny registration cross — print-atlas corner mark */
export const RegMark = memo(function RegMark({ className = "" }) {
  return <span className={`reg-mark ${className}`} aria-hidden />;
});

/** Two-tone hairline — used between blocks and as a stage divider */
export const Hairline = memo(function Hairline({ className = "" }) {
  return <div className={`hairline ${className}`} aria-hidden />;
});

/** Mono uppercase label with tracked-out letterspacing */
export const MonoLabel = memo(function MonoLabel({
  children,
  className = "",
  tone = "neutral",
}) {
  const colorMap = {
    neutral: "text-neutral-500",
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
    white: "text-white/80",
  };
  return (
    <span
      className={`font-mono-tight text-[10px] md:text-[11px] tracking-[0.32em] uppercase ${colorMap[tone]} ${className}`}
    >
      {children}
    </span>
  );
});

/** A status dot + pulse — used in headers */
export const StatusDot = memo(function StatusDot({ tone = "aqua" }) {
  const map = {
    aqua: "bg-aqua shadow-[0_0_10px_#33c2cc]",
    coral: "bg-coral shadow-[0_0_10px_#ea4884]",
    mint: "bg-mint shadow-[0_0_10px_#57db96]",
    lavender: "bg-lavender shadow-[0_0_10px_#7a57db]",
  };
  return (
    <span className={`relative inline-flex w-2 h-2 rounded-full ${map[tone]}`}>
      <span className="absolute inset-0 rounded-full animate-ping opacity-50" />
    </span>
  );
});

/**
 * Chapter header — every section uses this as its opening title.
 * Looks like a transmission slate: index · callsign · status · title.
 */
export const ChapterHeader = memo(function ChapterHeader({
  index,
  callsign,
  title,
  subtitle,
  tone = "aqua",
  rightMeta,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <div ref={ref} className="relative">
      {/* Top meta row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <StatusDot tone={tone} />
          <MonoLabel tone="neutral">TRANSMISSION · {index}</MonoLabel>
          <span className="block w-8 h-px bg-white/15" />
          <MonoLabel tone={tone}>{callsign}</MonoLabel>
        </div>
        {rightMeta && (
          <MonoLabel tone="neutral" className="opacity-80">
            {rightMeta}
          </MonoLabel>
        )}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 font-display-tight text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.04em] text-white"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 max-w-2xl text-neutral-400 text-base md:text-lg leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left center" }}
        className="mt-8"
      >
        <Hairline />
      </motion.div>
    </div>
  );
});

/**
 * ChapterFrame — full-bleed wrapper providing atmosphere, scanlines,
 * grain, and four corner registration marks. Drop a section inside.
 */
export const ChapterFrame = memo(function ChapterFrame({
  id,
  children,
  bare = false,
  className = "",
}) {
  return (
    <section
      id={id}
      className={`relative ${bare ? "" : "section-spacing"} ${className}`}
      // Full-bleed escape from parent max-width container
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {!bare && (
        <>
          {/* Soft atmosphere — drifts the eye across the page */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 80% 0%, rgba(122,87,219,0.10) 0%, rgba(3,4,18,0) 60%), radial-gradient(40% 40% at 10% 100%, rgba(51,194,204,0.07) 0%, rgba(3,4,18,0) 60%)",
            }}
          />
          <div className="starlog-scanlines opacity-[0.04]" aria-hidden />
          <RegMark className="!top-6 !left-6" />
          <RegMark className="!top-6 !right-6" />
          <RegMark className="!bottom-6 !left-6" />
          <RegMark className="!bottom-6 !right-6" />
        </>
      )}
      <div className="relative c-space max-w-7xl mx-auto">{children}</div>
    </section>
  );
});

/** A counter that animates up while the element is in view */
export const TelemetryStat = memo(function TelemetryStat({
  value,
  label,
  suffix = "",
  format = (n) => n.toLocaleString(),
  tone = "white",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * value);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const toneClass = {
    white: "text-white",
    aqua: "text-aqua",
    lavender: "text-lavender",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];

  return (
    <div ref={ref} className="border-l border-lavender/30 pl-4 py-1">
      <div className="font-mono-tight text-[10px] tracking-[0.28em] text-neutral-500 uppercase">
        {label}
      </div>
      <div
        className={`font-display-tight text-3xl md:text-4xl ${toneClass} leading-none mt-1 tabular-nums`}
      >
        {format(Math.round(n))}
        {suffix}
      </div>
    </div>
  );
});

/** A small mono pill — for tags, technologies, modes */
export const MonoPill = memo(function MonoPill({ children, tone = "lavender" }) {
  const toneMap = {
    lavender: "border-lavender/40 text-lavender",
    aqua: "border-aqua/40 text-aqua",
    coral: "border-coral/40 text-coral",
    mint: "border-mint/40 text-mint",
    neutral: "border-white/15 text-neutral-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border bg-black/30 font-mono-tight text-[10px] tracking-[0.18em] uppercase ${toneMap[tone]}`}
    >
      <span className="text-[8px] opacity-60">◇</span>
      {children}
    </span>
  );
});

/**
 * BeatPanel — a single content panel framed like an instrument module.
 * Header row + content body + optional footer tag.
 */
export const BeatPanel = memo(function BeatPanel({
  index,
  title,
  tone = "lavender",
  children,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const toneBorder = {
    lavender: "border-lavender/30 hover:border-lavender/60",
    aqua: "border-aqua/30 hover:border-aqua/60",
    coral: "border-coral/30 hover:border-coral/60",
    mint: "border-mint/30 hover:border-mint/60",
  }[tone];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-sm border ${toneBorder} bg-gradient-to-b from-midnight/80 to-primary/80 backdrop-blur-sm p-6 md:p-7 transition-colors group ${className}`}
    >
      {/* Corner bracket */}
      <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-current opacity-50" />
      <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-current opacity-50" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-current opacity-50" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-current opacity-50" />

      <header className="flex items-baseline justify-between mb-4">
        <MonoLabel tone={tone}>MOD · {index}</MonoLabel>
        <span className="block flex-1 mx-3 h-px bg-white/10" />
        <MonoLabel tone="neutral">STATUS · OK</MonoLabel>
      </header>

      <h3 className="font-display-tight text-2xl md:text-3xl text-white tracking-[-0.03em] mb-3">
        {title}
      </h3>

      <div className="text-neutral-400 text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </motion.article>
  );
});

/**
 * Reveal-on-view wrapper for arbitrary content.
 * Pass className so the motion wrapper participates in grid layout when needed.
 */
export const Reveal = memo(function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

/**
 * ScrollRail — a thin vertical progress indicator on the left edge of a section,
 * filling from top to bottom as the user scrolls through.
 */
export const ScrollRail = memo(function ScrollRail({ targetRef, label = "CHAPTER" }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });
  const height = useTransform(smooth, [0, 1], ["0%", "100%"]);
  return (
    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-2 xl:left-4 flex-col items-center gap-3 z-20 pointer-events-none">
      <span className="rotate-180 [writing-mode:vertical-rl] font-mono-tight text-[9px] tracking-[0.4em] text-neutral-500 uppercase">
        {label}
      </span>
      <div className="relative w-px h-[40vh] bg-white/10 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-lavender via-aqua to-coral"
          style={{ height }}
        />
      </div>
    </div>
  );
});

/* ============================================================
   PINNED SCROLLYTELLING PRIMITIVES
   Use PinnedStage as the wrapper for any chapter that needs
   beats overlaying inside one sticky viewport.
   ============================================================ */

/**
 * PinnedStage — full-bleed container with a sticky h-screen panel.
 * Children receive scrollYProgress (MotionValue 0→1 across full height).
 * Renders persistent header, atmosphere, scanlines, grain, reg-marks,
 * and a bottom progress rail.
 */
export const PinnedStage = memo(function PinnedStage({
  id,
  height = 400,
  index,
  callsign,
  tone = "lavender",
  beatLabels = [],
  children,
  hideHeader = false,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const toneText = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];

  return (
    <section
      id={id}
      ref={ref}
      className="relative"
      style={{
        height: `${height}vh`,
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {/* Atmosphere */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(122,87,219,0.14) 0%, rgba(3,4,18,0) 65%), radial-gradient(40% 40% at 80% 20%, rgba(51,194,204,0.09) 0%, rgba(3,4,18,0) 60%), radial-gradient(35% 35% at 15% 85%, rgba(234,72,132,0.07) 0%, rgba(3,4,18,0) 60%)",
            y: bgY,
          }}
        />
        <div className="starlog-scanlines" aria-hidden />
        <div className="starlog-grain" aria-hidden />

        {/* Corner registration marks */}
        <span className="reg-mark" style={{ top: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ top: 24, right: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, right: 24 }} aria-hidden />

        {/* Persistent header — offset below the fixed navbar */}
        {!hideHeader && (
          <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 font-mono-tight text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-neutral-500 z-40 whitespace-nowrap px-4">
            <span className="hidden sm:block w-6 h-px bg-lavender/60" />
            <span>TRANSMISSION · {index}</span>
            <span className="block w-4 md:w-6 h-px bg-white/15" />
            <span className={toneText}>{callsign}</span>
            <span className="hidden sm:block w-6 h-px bg-aqua/60" />
          </div>
        )}

        {/* Bottom progress rail */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(320px,72vw)] z-40">
          <div className="flex justify-between font-mono-tight text-[9px] tracking-[0.35em] text-neutral-500 mb-2 uppercase">
            <span>00</span>
            <span className="hidden sm:block text-center text-[8px] tracking-[0.3em]">
              {beatLabels.join(" · ")}
            </span>
            <span>01</span>
          </div>
          <div className="h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-coral"
              style={{ width: railWidth }}
            />
          </div>
        </div>

        {/* Beats live inside this container */}
        {typeof children === "function" ? children(scrollYProgress) : children}
      </div>
    </section>
  );
});

/**
 * Beat — wraps a single beat with absolute inset-0 and opacity tied
 * to a fade-in/peak/fade-out window of the parent scroll progress.
 * Children are positioned freely inside.
 */
export const Beat = memo(function Beat({
  progress,
  range, // [fadeInStart, peakStart, peakEnd, fadeOutEnd]
  className = "",
  children,
  style,
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{ opacity, ...style }}
    >
      {children}
    </motion.div>
  );
});

/**
 * ScrollCounter — counts from `from` → `to` tied to a local progress MV.
 * Unlike TelemetryStat (which fires on view), this is fully scroll-bound.
 */
export const ScrollCounter = memo(function ScrollCounter({
  progress,
  from = 0,
  to = 100,
  suffix = "",
  format = (n) => n.toLocaleString(),
  className = "",
}) {
  const v = useTransform(progress, [0, 1], [from, to]);
  const [n, setN] = useState(from);
  useEffect(() => v.on("change", (x) => setN(Math.round(x))), [v]);
  return (
    <span className={`tabular-nums ${className}`}>
      {format(n)}
      {suffix}
    </span>
  );
});

/**
 * WordReveal — splits a sentence into words and reveals each one
 * sequentially as `progress` moves from 0 → `revealWindow` (default 0.7).
 */
export const WordReveal = memo(function WordReveal({
  progress,
  text,
  revealWindow = 0.7,
  className = "",
  wordClassName = "",
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <WordChip
          key={i}
          progress={progress}
          word={w}
          index={i}
          total={words.length}
          window={revealWindow}
          className={wordClassName}
        />
      ))}
    </span>
  );
});

const WordChip = memo(function WordChip({
  progress,
  word,
  index,
  total,
  window: revealWindow,
  className,
}) {
  const start = (index / total) * revealWindow;
  const end = start + 0.08;
  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const y = useTransform(progress, [start, end], [24, 0], { clamp: true });
  const blur = useTransform(progress, [start, end], [8, 0], { clamp: true });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return (
    <motion.span
      style={{ opacity, y, filter, display: "inline-block" }}
      className={`mr-[0.25em] ${className}`}
    >
      {word}
    </motion.span>
  );
});

/** Tape-style number badge — used to index list items */
export const IndexTape = memo(function IndexTape({ n, total }) {
  return (
    <div className="inline-flex items-center gap-2 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500">
      <span className="text-lavender">{String(n).padStart(2, "0")}</span>
      <span className="block w-6 h-px bg-neutral-700" />
      <span>{String(total).padStart(2, "0")}</span>
    </div>
  );
});
