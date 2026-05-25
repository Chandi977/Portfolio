
import { memo, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../constants";
import {
  ChapterFrame,
  MonoLabel,
  MonoPill,
  StatusDot,
  Hairline,
} from "../components/starlog/ds";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   TRANSMISSION 06 // ARCHIVE  —  MISSION DOSSIERS
   No pinned scrollytelling. Vertical spine with dossier cards
   that enter via useInView (viewport-triggered → stays motion/react).
   Only the spine fill height is scroll-bound → GSAP ScrollTrigger.
   ============================================================ */

const TONES = ["lavender", "aqua", "coral", "mint"];

const yearOf = (date) => {
  const m = (date || "").match(/(\d{4})/g);
  return m ? m[m.length - 1] : "";
};

const monthOf = (date) => {
  const m = (date || "").match(
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,
  );
  return m ? m[1].toUpperCase() : "";
};

const Experiences = () => {
  const yearRange = (() => {
    const years = experiences.map((e) => Number(yearOf(e.date))).filter(Boolean);
    return `${Math.min(...years)} – ${Math.max(...years)}`;
  })();

  const sectionRef = useRef(null);
  const spineFillRef = useRef(null);

  // Spine fill driven by GSAP ScrollTrigger (replaces useScroll + useTransform)
  useEffect(() => {
    const el = sectionRef.current;
    const fill = spineFillRef.current;
    if (!el || !fill) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 0,
      onUpdate: (self) => {
        const h = Math.max(0, Math.min(100, self.progress * 100));
        fill.style.height = `${h}%`;
      },
    });

    return () => st.kill();
  }, []);

  return (
    <ChapterFrame id="experience" className="!mt-0">
      <div ref={sectionRef} className="relative pt-24 md:pt-28 pb-28">
        {/* ============ HEADER : Departure-board ============ */}
        <ManifestHeader yearRange={yearRange} count={experiences.length} />

        {/* ============ SPINE + DOSSIERS ============ */}
        <div className="relative mt-20 md:mt-28">
          {/* Vertical spine */}
          <div
            aria-hidden
            className="absolute left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-white/8"
          />
          {/* Filled portion — tracks scroll */}
          <div
            ref={spineFillRef}
            aria-hidden
            style={{ height: "0%" }}
            className="absolute left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 top-0 w-px bg-gradient-to-b from-lavender via-aqua to-coral"
          />

          <ul className="relative space-y-24 md:space-y-32">
            {experiences.map((item, i) => (
              <DossierEntry
                key={`${item.title}-${i}`}
                item={item}
                index={i}
                total={experiences.length}
                tone={TONES[i % TONES.length]}
              />
            ))}
          </ul>
        </div>

        {/* ============ FOOTER signoff ============ */}
        <div className="relative mt-24 md:mt-32 max-w-3xl mx-auto text-center">
          <div className="mx-auto w-[min(640px,80vw)]">
            <Hairline />
          </div>
          <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500 max-w-[min(640px,80vw)] mx-auto">
            <span>END · TRANSMISSION 06</span>
            <span>↓ 07 · INTERCEPTS</span>
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
};

export default memo(Experiences);

/* ============================================================
   Departure-board header (viewport-triggered — stays motion/react)
   ============================================================ */
const ManifestHeader = memo(function ManifestHeader({ yearRange, count }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  return (
    <header ref={ref} className="relative max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-6"
      >
        <StatusDot tone="lavender" />
        <MonoLabel tone="neutral">TRANSMISSION · 06</MonoLabel>
        <span className="block w-8 h-px bg-white/15" />
        <MonoLabel tone="lavender">ARCHIVE</MonoLabel>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display-tight text-4xl md:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[0.95]"
      >
        Mission <span className="italic text-lavender">dossiers,</span>
        <br className="hidden md:block" /> declassified.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-5 max-w-xl text-neutral-400 text-base md:text-lg leading-relaxed"
      >
        Every engagement, every role, every measurable outcome — pulled from
        the archive and stamped for review.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="mt-10 grid grid-cols-3 gap-px bg-white/10 border border-lavender/20 starlog-clip max-w-3xl"
      >
        <Slat label="FILES" value={String(count).padStart(2, "0")} tone="lavender" />
        <Slat label="SPAN" value={yearRange} tone="aqua" />
        <Slat label="STATUS" value="ON FILE" tone="mint" badge />
      </motion.div>
    </header>
  );
});

const Slat = memo(function Slat({ label, value, tone, badge }) {
  const toneClass = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    mint: "text-mint",
    coral: "text-coral",
  }[tone];
  return (
    <div className="bg-primary/85 px-4 py-3.5 flex items-center justify-between gap-3">
      <div>
        <div className="font-mono-tight text-[9px] tracking-[0.34em] text-neutral-500 uppercase">
          {label}
        </div>
        <div className={`font-display-tight text-xl md:text-2xl tracking-[-0.02em] mt-0.5 ${toneClass} tabular-nums`}>
          {value}
        </div>
      </div>
      {badge && (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 border ${tone === "mint" ? "border-mint/40" : "border-white/20"} font-mono-tight text-[9px] tracking-[0.3em] ${toneClass}`}>
          <span className={`block w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_8px_#57db96]`} />
          LIVE
        </span>
      )}
    </div>
  );
});

/* ============================================================
   DossierEntry — viewport-triggered (stays motion/react)
   ============================================================ */
const DossierEntry = memo(function DossierEntry({ item, index, total, tone }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -10% 0px" });

  const side = index % 2 === 0 ? "left" : "right";
  const fromX = side === "left" ? -40 : 40;

  const year = yearOf(item.date);
  const mo = monthOf(item.date);
  const fileNo = `06-${String(index + 1).padStart(3, "0")}`;

  const tokens = {
    lavender: {
      accent: "text-lavender",
      bg: "bg-lavender",
      border: "border-lavender/40",
      shadow: "shadow-[0_0_60px_-20px_rgba(122,87,219,0.6)]",
      from: "from-lavender/10",
    },
    aqua: {
      accent: "text-aqua",
      bg: "bg-aqua",
      border: "border-aqua/40",
      shadow: "shadow-[0_0_60px_-20px_rgba(51,194,204,0.6)]",
      from: "from-aqua/10",
    },
    coral: {
      accent: "text-coral",
      bg: "bg-coral",
      border: "border-coral/40",
      shadow: "shadow-[0_0_60px_-20px_rgba(234,72,132,0.6)]",
      from: "from-coral/10",
    },
    mint: {
      accent: "text-mint",
      bg: "bg-mint",
      border: "border-mint/40",
      shadow: "shadow-[0_0_60px_-20px_rgba(87,219,150,0.6)]",
      from: "from-mint/10",
    },
  }[tone];

  return (
    <li ref={ref} className="relative">
      {/* SPINE NODE */}
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 sm:left-8 md:left-1/2 md:-translate-x-1/2 top-6 z-20 -translate-x-1/2"
      >
        <span className={`relative block w-3.5 h-3.5 rounded-full ${tokens.bg} ring-4 ring-primary`}>
          <span className={`absolute inset-0 rounded-full ${tokens.bg} opacity-40 animate-ping`} />
        </span>
        <span className="hidden md:block absolute right-7 top-0 -translate-y-1 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500 whitespace-nowrap">
          {mo} {year}
        </span>
      </motion.span>

      {/* Card container */}
      <div
        className={`relative pl-12 sm:pl-20 md:pl-0 ${
          side === "left"
            ? "md:pr-[calc(50%+2.5rem)]"
            : "md:pl-[calc(50%+2.5rem)] md:pr-0"
        }`}
      >
        <motion.article
          initial={{ opacity: 0, x: fromX, y: 30 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{
            duration: 0.85,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`group relative ${tokens.shadow}`}
        >
          {/* Connector line */}
          <span
            aria-hidden
            className={`hidden md:block absolute top-7 ${
              side === "left" ? "right-0 translate-x-full" : "left-0 -translate-x-full"
            } w-8 h-px ${tokens.bg} opacity-50`}
          />

          {/* CARD */}
          <div className={`relative bg-gradient-to-br ${tokens.from} via-midnight/85 to-primary border ${tokens.border} starlog-clip overflow-hidden`}>
            {/* TOP STRIP */}
            <div className="relative flex items-stretch border-b border-white/10">
              <div className={`px-4 py-2.5 ${tokens.bg} bg-opacity-20 border-r border-white/10 flex items-center gap-2`}>
                <span className={`font-mono-tight text-[9px] tracking-[0.3em] ${tokens.accent} uppercase`}>
                  FILE · {fileNo}
                </span>
              </div>
              <div className="flex-1 px-4 py-2.5 flex items-center gap-3 overflow-hidden">
                <Barcode tone={tone} />
                <span className="font-mono-tight text-[9px] tracking-[0.32em] text-neutral-500 uppercase truncate">
                  {item.type || "ENGAGEMENT"} · {item.location?.split(",")[0] || "—"}
                </span>
              </div>
              <div className="px-4 py-2.5 border-l border-white/10 flex items-center gap-2">
                <span className="font-display-tight text-xl text-white tracking-[-0.02em] tabular-nums">
                  {year}
                </span>
              </div>
            </div>

            {/* BODY */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12">
              {/* MAIN COLUMN */}
              <div className="lg:col-span-8 p-5 md:p-7 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
                  animate={inView ? { opacity: 0.18, scale: 1, rotate: -8 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className={`absolute -top-3 right-4 px-3 py-1 border-2 ${tokens.border} ${tokens.accent} font-display-tight text-2xl md:text-3xl tracking-[0.1em] pointer-events-none select-none italic`}
                  aria-hidden
                >
                  {item.type === "Full-time" ? "ACTIVE" : "ARCHIVED"}
                </motion.div>

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <MonoLabel tone={tone}>ROLE · DECLARED</MonoLabel>
                  <span className={`block w-1 h-1 rounded-full ${tokens.bg}`} />
                  <MonoLabel>{item.date}</MonoLabel>
                </div>

                <h3 className="font-display-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.035em] leading-[1.05]">
                  {item.title}
                </h3>

                <p className="font-mono-tight text-[11px] md:text-xs text-neutral-400 mt-2 tracking-[0.16em] uppercase">
                  ◇ {item.job}
                  {item.location && (
                    <span className="ml-3 text-neutral-500 normal-case">
                      ({item.location})
                    </span>
                  )}
                </p>

                {item.description && (
                  <p className="mt-4 md:mt-5 text-sm md:text-base text-neutral-200 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.contents && item.contents.length > 0 && (
                  <div className="mt-5 md:mt-6 border-l-2 border-white/10 pl-4">
                    <MonoLabel tone="aqua" className="block mb-2">
                      OPS · LOG
                    </MonoLabel>
                    <ul className="space-y-1.5">
                      {item.contents.slice(0, 4).map((c, i) => (
                        <LogLine key={i} text={c} index={i} inView={inView} tone={tone} />
                      ))}
                    </ul>
                  </div>
                )}

                {item.technologies && (
                  <div className="mt-5 md:mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-2.5">
                      <MonoLabel>▶ ROUTES · CLEARED</MonoLabel>
                      <span className="block flex-1 h-px bg-white/5" />
                      <MonoLabel tone="neutral">
                        {item.technologies.length} TAGS
                      </MonoLabel>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.slice(0, 12).map((t, i) => (
                        <RouteTag key={t} label={t} index={i} inView={inView} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PERFORATED STUB */}
              <div className="lg:col-span-4 relative border-t lg:border-t-0 lg:border-l border-dashed border-white/15">
                <span aria-hidden className="hidden lg:flex absolute left-0 top-0 bottom-0 -translate-x-1/2 flex-col justify-between py-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="block w-2 h-2 rounded-full bg-primary border border-white/15" />
                  ))}
                </span>

                <div className="p-5 md:p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <MonoLabel tone={tone}>INTEL · STUB</MonoLabel>
                    <SealStamp tone={tone} index={index} />
                  </div>

                  {item.metrics && item.metrics.length > 0 ? (
                    <ul className="space-y-3 flex-1">
                      {item.metrics.slice(0, 3).map((m) => (
                        <li key={m.label} className="border-l-2 border-white/10 pl-3 py-1">
                          <div className={`font-display-tight text-2xl md:text-3xl ${tokens.accent} tracking-[-0.02em] leading-none tabular-nums`}>
                            {m.value}
                          </div>
                          <div className="mt-1.5 font-mono-tight text-[9px] tracking-[0.22em] text-neutral-400 uppercase leading-snug">
                            {m.label}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-neutral-600 italic font-display-tight text-sm">
                      no metrics on file
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono-tight text-[9px] tracking-[0.28em] text-neutral-500 uppercase">
                    <span>CLR · {tone.slice(0, 3).toUpperCase()}</span>
                    <span>{index + 1}/{total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM micro-strip */}
            <div className="relative border-t border-white/10 flex items-center justify-between px-4 py-2 bg-black/30">
              <span className="font-mono-tight text-[9px] tracking-[0.4em] text-neutral-600 uppercase">
                ◇ END · OF · FILE
              </span>
              <span className={`font-mono-tight text-[9px] tracking-[0.32em] ${tokens.accent} uppercase`}>
                {fileNo}
              </span>
            </div>
          </div>
        </motion.article>
      </div>
    </li>
  );
});

/* ============================================================
   Small sub-components (viewport-triggered — stay motion/react)
   ============================================================ */

const LogLine = memo(function LogLine({ text, index, inView, tone }) {
  const accent = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];
  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.3 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-2.5 text-[13px] md:text-sm text-neutral-300 leading-snug"
    >
      <span className={`font-mono-tight text-[10px] mt-1 tabular-nums ${accent}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>{text}</span>
    </motion.li>
  );
});

const RouteTag = memo(function RouteTag({ label, index, inView }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: 0.55 + index * 0.035, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-sm border border-white/15 bg-black/30 font-mono-tight text-[10px] tracking-[0.18em] text-neutral-300 uppercase"
    >
      <span className="text-[8px] opacity-50">◇</span>
      {label}
    </motion.span>
  );
});

const Barcode = memo(function Barcode({ tone }) {
  const stroke = {
    lavender: "bg-lavender/70",
    aqua: "bg-aqua/70",
    coral: "bg-coral/70",
    mint: "bg-mint/70",
  }[tone];
  const widths = [1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 1];
  return (
    <div className="flex items-end gap-[1.5px] h-4">
      {widths.map((w, i) => (
        <span key={i} className={`${i % 3 === 0 ? "bg-white/40" : stroke} block`} style={{ width: `${w}px`, height: i % 2 === 0 ? "100%" : "65%" }} />
      ))}
    </div>
  );
});

const SealStamp = memo(function SealStamp({ tone, index }) {
  const ring = {
    lavender: "border-lavender/70 text-lavender",
    aqua: "border-aqua/70 text-aqua",
    coral: "border-coral/70 text-coral",
    mint: "border-mint/70 text-mint",
  }[tone];
  return (
    <span
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border ${ring}`}
    >
      <span className={`absolute inset-1 rounded-full border border-current opacity-50`} />
      <span className="font-mono-tight text-[9px] tracking-[0.18em] uppercase">
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
});