
import { memo, useEffect, useRef, useState, useCallback, createContext, useContext } from "react";
import { motion, useInView } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { interpolate, interpolateString } from "../../hooks/useGSAPBeat";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   STARLOG · Design-System primitives
   Every chapter composes from these.

   GSAP ScrollTrigger drives all scroll-bound animations.
   motion/react stays for viewport-triggered reveals (useInView)
   and mount/hover animations only.
   ============================================================ */

/* ── Progress context ─────────────────────────────────────── */
const ProgressContext = createContext(null);
export const useProgress = () => useContext(ProgressContext);

/**
 * Lightweight reactive progress object.
 * Created once per PinnedStage and passed to children via context
 * and render-props.
 */
function createProgress() {
  let _value = 0;
  const _listeners = new Set();
  return {
    get: () => _value,
    set: (v) => {
      _value = v;
      for (const cb of _listeners) cb(v);
    },
    onChange: (cb) => {
      _listeners.add(cb);
      cb(_value);
      return () => _listeners.delete(cb);
    },
  };
}

/**
 * Hook: subscribe to a progress object and re-render when it changes.
 * Use sparingly — only for components that MUST re-render (counters, text).
 * For style-only updates, use refs + gsap.set in an onChange callback.
 */
export function useProgressValue(progress, mapFn) {
  const [value, setValue] = useState(() =>
    mapFn ? mapFn(progress.get()) : progress.get()
  );
  useEffect(() => {
    return progress.onChange((p) => {
      setValue(mapFn ? mapFn(p) : p);
    });
  }, [progress, mapFn]);
  return value;
}

/* ── Purely visual primitives (unchanged) ─────────────────── */

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
    aqua: "bg-aqua shadow-[0_0_8px_#33c2cc]",
    coral: "bg-coral shadow-[0_0_8px_#ea4884]",
    mint: "bg-mint shadow-[0_0_8px_#57db96]",
    lavender: "bg-lavender shadow-[0_0_8px_#7a57db]",
  };
  return (
    <span className={`relative inline-flex w-2 h-2 rounded-full ${map[tone]}`}>
      <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ animationDuration: "2.5s" }} />
    </span>
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

/* ── Viewport-triggered reveals (stay as motion/react) ───── */

/**
 * Chapter header — every section uses this as its opening title.
 * Viewport-triggered (not scroll-bound), so stays as motion/react.
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
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {!bare && (
        <>
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

/**
 * BeatPanel — a single content panel framed like an instrument module.
 * Viewport-triggered, stays as motion/react.
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
 * Viewport-triggered, stays as motion/react.
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

/* ============================================================
   SCROLL-BOUND PRIMITIVES — powered by GSAP ScrollTrigger
   ============================================================ */

/**
 * ScrollRail — a thin vertical progress indicator on the left edge,
 * filling from top to bottom as the user scrolls through.
 */
export const ScrollRail = memo(function ScrollRail({ targetRef, label = "CHAPTER" }) {
  const fillRef = useRef(null);

  useEffect(() => {
    const el = targetRef.current;
    const fill = fillRef.current;
    if (!el || !fill) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 0,
      onUpdate: (self) => {
        fill.style.height = `${self.progress * 100}%`;
      },
    });

    return () => st.kill();
  }, [targetRef]);

  return (
    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-2 xl:left-4 flex-col items-center gap-3 z-20 pointer-events-none">
      <span className="rotate-180 [writing-mode:vertical-rl] font-mono-tight text-[9px] tracking-[0.4em] text-neutral-500 uppercase">
        {label}
      </span>
      <div className="relative w-px h-[40vh] bg-white/10 overflow-hidden">
        <div
          ref={fillRef}
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-lavender via-aqua to-coral"
          style={{ height: "0%" }}
        />
      </div>
    </div>
  );
});

/* ============================================================
   PINNED SCROLLYTELLING PRIMITIVES
   PinnedStage + Beat — GSAP ScrollTrigger
   ============================================================ */

/**
 * PinnedStage — full-bleed container with a sticky h-screen panel.
 * GSAP ScrollTrigger drives a progress object (0→1) that children consume.
 *
 * Children receive the progress object via both:
 *   1. Render-prop: children(progress)
 *   2. React context: useProgress()
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
  const outerRef = useRef(null);
  const bgRef = useRef(null);
  const railFillRef = useRef(null);
  const [progress] = useState(() => createProgress());

  useEffect(() => {
    const outer = outerRef.current;
    const bg = bgRef.current;
    const railFill = railFillRef.current;
    if (!outer) return;

    const st = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "bottom bottom",
      scrub: 0,
      onUpdate: (self) => {
        const p = self.progress;
        progress.set(p);
        // Atmosphere parallax
        if (bg) bg.style.transform = `translateY(${interpolate(p, [0, 1], [0, -12])}%)`;
        // Rail fill
        if (railFill) railFill.style.width = `${p * 100}%`;
      },
    });

    return () => st.kill();
  }, [progress]);

  const toneText = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];

  return (
    <section
      id={id}
      ref={outerRef}
      className="relative"
      style={{
        height: `${height}vh`,
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {/* Atmosphere */}
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, rgba(122,87,219,0.14) 0%, rgba(3,4,18,0) 65%), radial-gradient(40% 40% at 80% 20%, rgba(51,194,204,0.09) 0%, rgba(3,4,18,0) 60%), radial-gradient(35% 35% at 15% 85%, rgba(234,72,132,0.07) 0%, rgba(3,4,18,0) 60%)",
            willChange: "transform",
          }}
        />
        <div className="starlog-scanlines" aria-hidden />
        <div className="starlog-grain" aria-hidden />

        {/* Corner registration marks */}
        <span className="reg-mark" style={{ top: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ top: 24, right: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, right: 24 }} aria-hidden />

        {/* Persistent header */}
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
            <div
              ref={railFillRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-coral"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Beats live inside this container */}
        <ProgressContext.Provider value={progress}>
          {typeof children === "function" ? children(progress) : children}
        </ProgressContext.Provider>
      </div>
    </section>
  );
});

/**
 * Beat — wraps a single beat with absolute inset-0 and opacity tied
 * to a fade-in/peak/fade-out window of the parent scroll progress.
 *
 * range = [fadeInStart, peakStart, peakEnd, fadeOutEnd]
 *
 * Uses GSAP-style direct DOM updates via the progress object's onChange.
 */
export const Beat = memo(function Beat({
  progress,
  range,
  className = "",
  children,
  style: extraStyle,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!progress || !ref.current) return;
    return progress.onChange((p) => {
      const opacity = interpolate(p, range, [0, 1, 1, 0]);
      const el = ref.current;
      if (el) {
        el.style.opacity = opacity;
        // Toggle pointer-events so invisible beats don't block interaction
        el.style.pointerEvents = opacity > 0.01 ? "auto" : "none";
        // Toggle visibility to reduce compositing cost when fully hidden
        el.style.visibility = opacity > 0.001 ? "visible" : "hidden";
      }
    });
  }, [progress, range]);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 ${className}`}
      style={{ opacity: 0, willChange: "opacity", ...extraStyle }}
    >
      {children}
    </div>
  );
});

/**
 * ScrollCounter — counts from `from` → `to` tied to a progress object.
 * Fully scroll-bound via GSAP progress.
 */
export const ScrollCounter = memo(function ScrollCounter({
  progress,
  from = 0,
  to = 100,
  suffix = "",
  format = (n) => n.toLocaleString(),
  className = "",
}) {
  const [n, setN] = useState(from);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      setN(Math.round(from + p * (to - from)));
    });
  }, [progress, from, to]);

  return (
    <span className={`tabular-nums ${className}`}>
      {format(n)}
      {suffix}
    </span>
  );
});

/**
 * WordReveal — splits a sentence into words and reveals each one
 * sequentially as scroll progress moves from 0 → revealWindow.
 *
 * Uses direct DOM style updates for performance.
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
          revealWindow={revealWindow}
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
  revealWindow,
  className,
}) {
  const ref = useRef(null);
  const start = (index / total) * revealWindow;
  const end = start + 0.08;

  useEffect(() => {
    if (!progress || !ref.current) return;
    return progress.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      const opacity = interpolate(p, [start, end], [0, 1]);
      const y = interpolate(p, [start, end], [24, 0]);
      el.style.opacity = opacity;
      el.style.transform = `translateY(${y}px)`;
    });
  }, [progress, start, end]);

  return (
    <span
      ref={ref}
      style={{ opacity: 0, display: "inline-block", willChange: "transform, opacity" }}
      className={`mr-[0.25em] ${className}`}
    >
      {word}
    </span>
  );
});

/**
 * ProgressDriven — a generic component that updates a ref's inline
 * styles based on scroll progress. Takes a `styleFn(progress)` that
 * returns a CSSStyleDeclaration-like object.
 *
 * Usage:
 *   <ProgressDriven
 *     progress={p}
 *     styleFn={(p) => ({ opacity: interpolate(p, [...], [...]) })}
 *     className="..."
 *   >
 *     {children}
 *   </ProgressDriven>
 */
export const ProgressDriven = memo(function ProgressDriven({
  progress,
  styleFn,
  className = "",
  children,
  tag: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!progress || !ref.current) return;
    return progress.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      const styles = styleFn(p);
      for (const [key, val] of Object.entries(styles)) {
        el.style[key] = typeof val === "number" && key !== "opacity" ? `${val}px` : val;
      }
    });
  }, [progress, styleFn]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
});

/**
 * useProgressStyle — hook version of ProgressDriven.
 * Returns a ref to attach to your element. Applies styles via
 * the styleFn callback on every progress change.
 */
export function useProgressStyle(progress, styleFn) {
  const ref = useRef(null);

  useEffect(() => {
    if (!progress || !ref.current) return;
    return progress.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      const styles = styleFn(p);
      for (const [key, val] of Object.entries(styles)) {
        el.style[key] = typeof val === "number" && key !== "opacity" && key !== "scale"
          ? `${val}px`
          : String(val);
      }
    });
  }, [progress, styleFn]);

  return ref;
}

/**
 * createSubProgress — derives a child progress from a parent progress
 * by mapping a [start, end] range of the parent to [0, 1] in the child.
 *
 * This replaces: useTransform(parentP, [start, end], [0, 1], { clamp: true })
 */
export function createSubProgress(parentProgress, start, end) {
  const sub = createProgress();
  const unsub = parentProgress.onChange((p) => {
    const clamped = Math.max(0, Math.min(1, (p - start) / (end - start || 0.001)));
    sub.set(clamped);
  });
  // Attach unsub so callers can clean up
  sub._unsub = unsub;
  return sub;
}

/**
 * useSubProgress — hook that creates and manages a sub-progress
 * derived from a parent progress over a [start, end] range.
 */
export function useSubProgress(parentProgress, start, end) {
  const subRef = useRef(null);

  if (!subRef.current) {
    subRef.current = createProgress();
  }

  useEffect(() => {
    if (!parentProgress) return;
    return parentProgress.onChange((p) => {
      const clamped = Math.max(0, Math.min(1, (p - start) / (end - start || 0.001)));
      subRef.current.set(clamped);
    });
  }, [parentProgress, start, end]);

  return subRef.current;
}
