import { memo, useRef, useEffect, useState, useCallback } from "react";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import {
  PinnedStage,
  Beat,
  WordReveal,
  ScrollCounter,
  MonoLabel,
  StatusDot,
  Hairline,
  useSubProgress,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

/* ============================================================
   TRANSMISSION 03 // IDENTITY
   420vh pinned. Five beats overlay inside one sticky viewport.
   ============================================================ */

const SKILLS = [
  { label: "MERN Stack",       code: "STACK",  group: "core",   tone: "lavender" },
  { label: "System Design",    code: "ARCH",   group: "core",   tone: "aqua" },
  { label: "Node / Express",   code: "API.RT", group: "back",   tone: "mint" },
  { label: "React.js",         code: "UI.19",  group: "front",  tone: "lavender" },
  { label: "MongoDB",          code: "DB.NS",  group: "data",   tone: "coral" },
  { label: "Redis / FlashKV",  code: "CACHE",  group: "data",   tone: "aqua" },
  { label: "AWS · EC2 · S3",   code: "CLOUD",  group: "infra",  tone: "mint" },
  { label: "WebSockets",       code: "WS.RT",  group: "back",   tone: "coral" },
  { label: "REST APIs",        code: "HTTP",   group: "back",   tone: "lavender" },
  { label: "JWT Auth",         code: "AUTH",   group: "back",   tone: "aqua" },
  { label: "DSA / Algorithms", code: "ALGO",   group: "core",   tone: "mint" },
  { label: "Docker · CI/CD",   code: "DEPLOY", group: "infra",  tone: "coral" },
];

const TELEMETRY = [
  { from: 0, to: 1428, label: "COMMITS / YEAR", tone: "lavender" },
  { from: 0, to: 17, label: "SYSTEMS SHIPPED", tone: "aqua" },
  { from: 0, to: 200, suffix: "+", label: "DSA SOLVED", tone: "mint" },
  { from: 240, to: 38, suffix: "ms", label: "P99 LATENCY", tone: "coral" },
];

const About = () => (
  <PinnedStage
    id="about"
    index="03"
    callsign="IDENTITY"
    tone="lavender"
    height={420}
    beatLabels={["STATEMENT", "TELEMETRY", "CAPABILITIES", "ORIGIN", "HANDOFF"]}
  >
    {(p) => <AboutBeats p={p} />}
  </PinnedStage>
);

const AboutBeats = ({ p }) => {
  const beat1P = useSubProgress(p, 0.00, 0.16);
  const beat2P = useSubProgress(p, 0.22, 0.38);
  const beat3P = useSubProgress(p, 0.44, 0.60);
  const beat4P = useSubProgress(p, 0.66, 0.84);
  const beat5P = useSubProgress(p, 0.90, 0.99);

  return (
    <>
      {/* ════════════ BEAT 1 — STATEMENT ════════════ */}
      <Beat progress={p} range={[0, 0, 0.18, 0.21]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="lavender" />
            <MonoLabel tone="lavender">DOSSIER · 03.01 · OPEN</MonoLabel>
          </div>
          <h2 className="font-display-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={beat1P}
              text="Hi, I'm Chandi Charan Mahato — a full-stack engineer who ships systems, not slides."
              revealWindow={0.7}
            />
          </h2>
          <ScrollIndicator progress={beat1P} start={0.78} end={0.95} />
        </div>
      </Beat>

      {/* ════════════ BEAT 2 — TELEMETRY ════════════ */}
      <Beat progress={p} range={[0.18, 0.22, 0.40, 0.43]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <FadeIn progress={beat2P} start={0} end={0.15}>
            <div className="flex items-center gap-3 mb-10">
              <StatusDot tone="aqua" />
              <MonoLabel tone="aqua">::TELEMETRY · 03.02 · LIVE</MonoLabel>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl w-full">
            {TELEMETRY.map((t, i) => (
              <TelemetryRoll key={t.label} pBeat={beat2P} index={i} {...t} />
            ))}
          </div>

          <FadeIn progress={beat2P} start={0.55} end={0.75}>
            <p className="mt-12 text-neutral-400 max-w-2xl text-center text-sm md:text-base italic font-display-tight">
              Numbers from the workshop floor. Latency cut by caching, deploys hardened by retries,
              and a stubborn habit of finishing what I start.
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* ════════════ BEAT 3 — CAPABILITIES ════════════ */}
      <Beat progress={p} range={[0.40, 0.44, 0.62, 0.65]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <FadeIn progress={beat3P} start={0} end={0.12}>
            <div className="flex items-center gap-3 mb-6">
              <StatusDot tone="coral" />
              <MonoLabel tone="coral">::CAPABILITIES · 03.03 · MANIFEST</MonoLabel>
              <span className="block w-8 h-px bg-white/15" />
              <MonoLabel>{SKILLS.length} ENTRIES</MonoLabel>
            </div>
          </FadeIn>

          <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] mb-3 text-center">
            Stack <span className="italic text-coral/90">manifest.</span>
          </h3>

          <FadeIn progress={beat3P} start={0.05} end={0.18}>
            <div className="mb-6 flex items-center gap-4 font-mono-tight text-[9px] tracking-[0.35em] text-neutral-500 uppercase">
              <span>◀ index</span>
              <span className="block w-12 h-px bg-white/10" />
              <span>signal · band</span>
              <span className="block w-12 h-px bg-white/10" />
              <span>module ▶</span>
            </div>
          </FadeIn>

          <div className="relative max-w-5xl w-full">
            <ManifestGrid pBeat={beat3P} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3 relative z-10">
              {SKILLS.map((s, i) => (
                <SkillCard key={s.label} pBeat={beat3P} index={i} total={SKILLS.length} {...s} />
              ))}
            </div>
          </div>

          <FadeIn progress={beat3P} start={0.78} end={0.92}>
            <div className="mt-6 flex items-center gap-4 font-mono-tight text-[9px] tracking-[0.4em] text-neutral-500 uppercase">
              <span className="text-mint">● SYNC</span>
              <span>12 / 12 modules loaded</span>
              <span className="text-aqua">● LIVE</span>
            </div>
          </FadeIn>
        </div>
      </Beat>

      {/* ════════════ BEAT 4 — ORIGIN ════════════ */}
      <Beat progress={p} range={[0.62, 0.66, 0.86, 0.89]}>
        <OriginBeat beat4P={beat4P} />
      </Beat>

      {/* ════════════ BEAT 5 — HANDOFF ════════════ */}
      <Beat progress={p} range={[0.86, 0.90, 1.0, 1.0]}>
        <HandoffBeat beat5P={beat5P} />
      </Beat>
    </>
  );
};

/* ---------- Utility: FadeIn wrapper ---------- */
const FadeIn = memo(function FadeIn({ progress, start, end, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      if (ref.current) ref.current.style.opacity = interpolate(p, [start, end], [0, 1]);
    });
  }, [progress, start, end]);
  return <div ref={ref} style={{ opacity: 0 }}>{children}</div>;
});

/* ---------- Scroll Indicator ---------- */
const ScrollIndicator = memo(function ScrollIndicator({ progress, start, end }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      if (ref.current) ref.current.style.opacity = interpolate(p, [start, end], [0, 1]);
    });
  }, [progress, start, end]);
  return (
    <div ref={ref} style={{ opacity: 0 }} className="mt-10 flex items-center gap-4">
      <span className="block w-8 h-px bg-lavender/60" />
      <MonoLabel tone="aqua">SCROLL TO CONTINUE ↓</MonoLabel>
      <span className="block w-8 h-px bg-aqua/60" />
    </div>
  );
});

/* ---------- TelemetryRoll ---------- */
const TelemetryRoll = memo(function TelemetryRoll({ pBeat, index, from, to, suffix = "", label, tone }) {
  const ref = useRef(null);
  const start = 0.05 + index * 0.04;
  const end = 0.40 + index * 0.04;

  // Sub-progress for the counter
  const counterP = useSubProgress(pBeat, start, end);

  useEffect(() => {
    if (!pBeat) return;
    return pBeat.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = interpolate(p, [start - 0.03, start + 0.03], [0, 1]);
      el.style.transform = `translateY(${interpolate(p, [start - 0.03, start + 0.03], [40, 0])}px)`;
    });
  }, [pBeat, start]);

  const toneClass = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];

  return (
    <div ref={ref} style={{ opacity: 0, willChange: "transform, opacity" }} className="border-l-2 border-lavender/40 pl-4">
      <MonoLabel tone="neutral" className="block mb-2">{label}</MonoLabel>
      <div className={`font-display-tight text-5xl md:text-6xl tracking-[-0.04em] ${toneClass}`}>
        <ScrollCounter progress={counterP} from={from} to={to} suffix={suffix} />
      </div>
    </div>
  );
});

/* ---------- SkillCard ---------- */
const RIPPLE_ORDER = [5, 6, 4, 7, 1, 2, 9, 10, 0, 3, 8, 11];

const SkillCard = memo(function SkillCard({ pBeat, index, total, label, code, group, tone }) {
  const ref = useRef(null);
  const scanRef = useRef(null);
  const railRef = useRef(null);

  const rank = RIPPLE_ORDER.indexOf(index);
  const start = 0.10 + (rank / total) * 0.45;
  const end = start + 0.14;

  useEffect(() => {
    if (!pBeat) return;
    return pBeat.onChange((p) => {
      const el = ref.current;
      if (!el) return;

      const opacity = interpolate(p, [start, end], [0, 1]);
      const y = interpolate(p, [start, end], [24, 0]);
      const scale = interpolate(p, [start, end], [0.9, 1]);
      el.style.opacity = opacity;
      el.style.transform = `translateY(${y}px) scale(${scale})`;

      if (scanRef.current) {
        const scanX = interpolate(p, [start, end], [-110, 110]);
        const scanOp = interpolate(p, [start, start + 0.04, end - 0.04, end], [0, 1, 1, 0]);
        scanRef.current.style.transform = `translateX(${scanX}%)`;
        scanRef.current.style.opacity = scanOp;
      }

      if (railRef.current) {
        railRef.current.style.transform = `scaleX(${interpolate(p, [start, end], [0, 1])})`;
      }
    });
  }, [pBeat, start, end]);

  const tokens = {
    lavender: {
      border: "border-lavender/30 group-hover:border-lavender/70",
      text: "text-lavender",
      dot: "bg-lavender",
      glow: "group-hover:shadow-[0_0_30px_-12px_rgba(122,87,219,0.6)]",
    },
    aqua: {
      border: "border-aqua/30 group-hover:border-aqua/70",
      text: "text-aqua",
      dot: "bg-aqua",
      glow: "group-hover:shadow-[0_0_30px_-12px_rgba(51,194,204,0.6)]",
    },
    coral: {
      border: "border-coral/30 group-hover:border-coral/70",
      text: "text-coral",
      dot: "bg-coral",
      glow: "group-hover:shadow-[0_0_30px_-12px_rgba(234,72,132,0.6)]",
    },
    mint: {
      border: "border-mint/30 group-hover:border-mint/70",
      text: "text-mint",
      dot: "bg-mint",
      glow: "group-hover:shadow-[0_0_30px_-12px_rgba(87,219,150,0.6)]",
    },
  }[tone];

  return (
    <div
      ref={ref}
      style={{ opacity: 0, willChange: "transform", transformPerspective: 800 }}
      className={`group relative overflow-hidden bg-gradient-to-b from-midnight/80 to-primary/90 border ${tokens.border} ${tokens.glow} transition-shadow duration-300 starlog-clip hover:-translate-y-[3px] transition-transform`}
    >
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative flex items-center justify-between px-3 pt-2.5">
        <span className="font-mono-tight text-[9px] tracking-[0.32em] text-neutral-500">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`block w-1.5 h-1.5 rounded-full ${tokens.dot}`} />
          <span className={`font-mono-tight text-[9px] tracking-[0.28em] ${tokens.text}`}>
            {code}
          </span>
        </div>
      </div>

      <div className="relative px-3 pt-2.5 pb-1">
        <span className={`inline-block text-[10px] ${tokens.text} opacity-70`}>◇</span>
      </div>

      <div className="relative px-3 pb-3">
        <div className="font-mono-tight text-[11px] md:text-[12px] tracking-[0.12em] text-white uppercase leading-tight">
          {label}
        </div>
        <div className="mt-1 font-mono-tight text-[8.5px] tracking-[0.35em] text-neutral-500 uppercase">
          // {group}
        </div>
      </div>

      <div className="relative h-px bg-white/5 overflow-hidden">
        <div
          ref={railRef}
          style={{ transformOrigin: "left", transform: "scaleX(0)" }}
          className={`absolute inset-0 ${tokens.dot} opacity-60`}
        />
      </div>

      <span
        ref={scanRef}
        aria-hidden
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
});

/* ---------- ManifestGrid ---------- */
const ManifestGrid = memo(function ManifestGrid({ pBeat }) {
  const svgRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    if (!pBeat) return;
    return pBeat.onChange((p) => {
      const svg = svgRef.current;
      if (!svg) return;
      svg.style.opacity = interpolate(p, [0.05, 0.25], [0, 0.4]);
      const dash = interpolate(p, [0.05, 0.30], [180, 0]);
      linesRef.current.forEach((line) => {
        if (line) line.setAttribute("stroke-dashoffset", dash);
      });
    });
  }, [pBeat]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      style={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 400 200"
    >
      {[0.25, 0.5, 0.75].map((y, i) => (
        <line
          key={`h${y}`}
          ref={(el) => (linesRef.current[i] = el)}
          x1="0" y1={200 * y} x2="400" y2={200 * y}
          stroke="rgba(155,128,245,0.25)"
          strokeDasharray="3 5"
          strokeDashoffset="180"
        />
      ))}
      {[0.33, 0.66].map((x, i) => (
        <line
          key={`v${x}`}
          ref={(el) => (linesRef.current[3 + i] = el)}
          x1={400 * x} y1="0" x2={400 * x} y2="200"
          stroke="rgba(51,194,204,0.18)"
          strokeDasharray="3 5"
          strokeDashoffset="180"
        />
      ))}
    </svg>
  );
});

/* ---------- OriginBeat ---------- */
const OriginBeat = memo(function OriginBeat({ beat4P }) {
  const leftRef = useRef(null);
  const globeWrapRef = useRef(null);
  const outerRingRef = useRef(null);
  const coordRef = useRef(null);
  const crosshairRef = useRef(null);
  const trackingRef = useRef(null);
  const cornerRefs = useRef([]);

  useEffect(() => {
    if (!beat4P) return;
    return beat4P.onChange((p) => {
      // Left copy
      if (leftRef.current) leftRef.current.style.opacity = interpolate(p, [0.02, 0.22], [0, 1]);

      // Globe scale
      if (globeWrapRef.current) {
        const scale = interpolate(p, [0, 0.5, 1], [0.85, 1, 1.02]);
        globeWrapRef.current.style.transform = `scale(${scale})`;
      }

      // Ring rotation
      if (outerRingRef.current) {
        const rotate = interpolate(p, [0, 1], [-12, 12]);
        outerRingRef.current.style.transform = `rotate(${rotate}deg)`;
      }

      // Coord panel
      if (coordRef.current) coordRef.current.style.opacity = interpolate(p, [0.18, 0.45], [0, 1]);

      // Center crosshair
      if (crosshairRef.current) crosshairRef.current.style.opacity = interpolate(p, [0.35, 0.6], [0, 0.7]);

      // Tracking
      if (trackingRef.current) trackingRef.current.style.opacity = interpolate(p, [0.5, 0.75], [0, 1]);

      // Corner readouts
      const delays = [0, 0.05, 0.10, 0.15];
      cornerRefs.current.forEach((el, i) => {
        if (el) el.style.opacity = interpolate(p, [0.25 + delays[i], 0.45 + delays[i]], [0, 1]);
      });
    });
  }, [beat4P]);

  return (
    <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 md:px-12 pt-32 md:pt-40 pb-24">
      {/* LEFT — copy stack */}
      <div ref={leftRef} style={{ opacity: 0 }} className="lg:col-span-4 flex flex-col justify-center max-w-md mx-auto lg:mx-0">
        <div className="flex items-center gap-3 mb-5">
          <StatusDot tone="aqua" />
          <MonoLabel tone="aqua">::SIGNAL · ORIGIN · LOCK</MonoLabel>
        </div>
        <h3 className="font-display-tight text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.035em] leading-[1] mb-6">
          Broadcasting from <span className="italic text-aqua">Noida.</span>
        </h3>
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6">
          Working out of northern India and shipping for teams across nine
          time zones. The globe spins live — drag it to look around.
        </p>

        <div ref={coordRef} style={{ opacity: 0 }} className="grid grid-cols-2 gap-px bg-white/10 starlog-clip border border-aqua/20">
          {[
            { k: "LAT", v: "28.5355° N", tone: "lavender" },
            { k: "LON", v: "77.3910° E", tone: "lavender" },
            { k: "TZ",  v: "UTC +5:30",  tone: "aqua" },
            { k: "LOCK",v: "1.000",       tone: "mint" },
          ].map((row) => (
            <div key={row.k} className="bg-primary/85 px-3 py-2.5">
              <div className="font-mono-tight text-[9px] tracking-[0.32em] text-neutral-500 uppercase">{row.k}</div>
              <div className={`font-mono-tight text-[11px] tracking-[0.18em] mt-1 ${
                row.tone === "aqua" ? "text-aqua" : row.tone === "mint" ? "text-mint" : "text-lavender"
              }`}>{row.v}</div>
            </div>
          ))}
        </div>

        <div ref={trackingRef} style={{ opacity: 0 }} className="mt-6 flex items-center gap-3 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
          <span className="block w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          <span>10 ROUTES · TRACKING</span>
        </div>
      </div>

      {/* RIGHT — globe */}
      <div className="lg:col-span-8 relative flex items-center justify-center min-h-0">
        <div ref={globeWrapRef} className="relative w-[min(82vmin,640px)] aspect-square" style={{ willChange: "transform" }}>
          <div ref={outerRingRef} className="absolute inset-[-6%] pointer-events-none" style={{ willChange: "transform" }}>
            <svg viewBox="-100 -100 200 200" className="w-full h-full">
              <circle r="98" fill="none" stroke="rgba(122,87,219,0.22)" strokeDasharray="0.6 2" />
              <circle r="86" fill="none" stroke="rgba(51,194,204,0.16)" />
              {[0, 90, 180, 270].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <line x1="0" y1="-99" x2="0" y2="-92" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
                </g>
              ))}
              <text x="0" y="-103" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">N</text>
              <text x="103" y="2" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">E</text>
              <text x="0" y="108" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">S</text>
              <text x="-103" y="2" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">W</text>
            </svg>
          </div>

          <Globe className="!max-w-none" />

          <div ref={crosshairRef} style={{ opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-12 h-12 border border-coral/60 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-coral shadow-[0_0_12px_#ea4884]" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-mono-tight text-[9px] tracking-[0.32em] text-coral whitespace-nowrap">
              NOIDA · 28.5°N
            </div>
          </div>

          {/* Corner readouts */}
          {[
            { pos: "top-2 left-2", tone: "lavender", toneClass: "text-lavender border-lavender/30", k: "EPOCH", v: "2026.144" },
            { pos: "top-2 right-2", tone: "aqua", toneClass: "text-aqua border-aqua/30", k: "HDG", v: "088°" },
            { pos: "bottom-2 left-2", tone: "mint", toneClass: "text-mint border-mint/30", k: "ALT", v: "GEO·1" },
            { pos: "bottom-2 right-2", tone: "coral", toneClass: "text-coral border-coral/30", k: "LOCK", v: "1.000" },
          ].map((cr, i) => (
            <div
              key={cr.k}
              ref={(el) => (cornerRefs.current[i] = el)}
              style={{ opacity: 0 }}
              className={`absolute ${cr.pos} hidden md:flex items-center gap-2 px-2 py-1 bg-primary/80 backdrop-blur-sm border ${cr.toneClass} font-mono-tight text-[9px] tracking-[0.25em]`}
            >
              <span className="text-neutral-500">{cr.k}</span>
              <span className="block w-px h-2.5 bg-white/15" />
              <span>{cr.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ---------- HandoffBeat ---------- */
const HandoffBeat = memo(function HandoffBeat({ beat5P }) {
  const scaleRef = useRef(null);
  const hairRef = useRef(null);

  useEffect(() => {
    if (!beat5P) return;
    return beat5P.onChange((p) => {
      if (scaleRef.current) {
        scaleRef.current.style.transform = `scale(${interpolate(p, [0, 0.6], [0.94, 1])})`;
      }
      if (hairRef.current) {
        hairRef.current.style.transform = `scaleX(${interpolate(p, [0, 0.7], [0, 1])})`;
      }
    });
  }, [beat5P]);

  return (
    <div ref={scaleRef} className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center" style={{ willChange: "transform" }}>
      <MonoLabel tone="lavender" className="mb-6">END · TRANSMISSION 03</MonoLabel>
      <h3 className="font-display-tight text-4xl md:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[1] mb-8 max-w-4xl">
        Want to build <span className="italic text-aqua">something</span> together?
      </h3>
      <CopyEmailButton />
      <div ref={hairRef} style={{ transformOrigin: "center", transform: "scaleX(0)" }} className="mt-12 w-[min(640px,80vw)]">
        <Hairline />
        <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          <span>03 · IDENTITY</span>
          <span>↓ 04 · SERVICES</span>
        </div>
      </div>
    </div>
  );
});

export default memo(About);
