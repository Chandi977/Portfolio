import { memo } from "react";
import { motion, useTransform } from "motion/react";
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
} from "../components/starlog/ds";

/* ============================================================
   TRANSMISSION 03 // IDENTITY
   420vh pinned. Five beats overlay inside one sticky viewport.

   Each beat has the same shape:
     fadeIn   →  peakStart  (0.03 of scroll)
     peakStart → contentEnd (~70% of peak, internal animations play)
     contentEnd → peakEnd   (hold fully visible, ~25% of peak)
     peakEnd  →  fadeOut    (0.03 of scroll)

   This guarantees that every reveal completes BEFORE opacity drops.
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
  /* Internal beat progress is mapped to the PEAK window only — so a
     0→1 sweep of beatP happens while the beat is fully on-screen. */
  const beat1P = useTransform(p, [0.00, 0.16], [0, 1], { clamp: true });
  const beat2P = useTransform(p, [0.22, 0.38], [0, 1], { clamp: true });
  const beat3P = useTransform(p, [0.44, 0.60], [0, 1], { clamp: true });
  const beat4P = useTransform(p, [0.66, 0.84], [0, 1], { clamp: true });
  const beat5P = useTransform(p, [0.90, 0.99], [0, 1], { clamp: true });

  /* ORIGIN beat — globe transforms tied to local beat4P */
  const globeScale = useTransform(beat4P, [0, 0.5, 1], [0.85, 1, 1.02]);
  const ringRotate = useTransform(beat4P, [0, 1], [-12, 12]);
  const coordOpacity = useTransform(beat4P, [0.18, 0.45], [0, 1], { clamp: true });

  /* HANDOFF */
  const ctaScale = useTransform(beat5P, [0, 0.6], [0.94, 1]);
  const hairlineScale = useTransform(beat5P, [0, 0.7], [0, 1]);

  return (
    <>
      {/* ════════════ BEAT 1 — STATEMENT (0.00 → 0.21) ════════════ */}
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
          <motion.div
            style={{ opacity: useTransform(beat1P, [0.78, 0.95], [0, 1]) }}
            className="mt-10 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-lavender/60" />
            <MonoLabel tone="aqua">SCROLL TO CONTINUE ↓</MonoLabel>
            <span className="block w-8 h-px bg-aqua/60" />
          </motion.div>
        </div>
      </Beat>

      {/* ════════════ BEAT 2 — TELEMETRY (0.18 → 0.43) ════════════ */}
      <Beat progress={p} range={[0.18, 0.22, 0.40, 0.43]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <motion.div
            style={{ opacity: useTransform(beat2P, [0, 0.15], [0, 1]) }}
            className="flex items-center gap-3 mb-10"
          >
            <StatusDot tone="aqua" />
            <MonoLabel tone="aqua">::TELEMETRY · 03.02 · LIVE</MonoLabel>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-6xl w-full">
            {TELEMETRY.map((t, i) => (
              <TelemetryRoll
                key={t.label}
                pBeat={beat2P}
                index={i}
                {...t}
              />
            ))}
          </div>

          <motion.p
            style={{ opacity: useTransform(beat2P, [0.55, 0.75], [0, 1]) }}
            className="mt-12 text-neutral-400 max-w-2xl text-center text-sm md:text-base italic font-display-tight"
          >
            Numbers from the workshop floor. Latency cut by caching, deploys hardened by retries,
            and a stubborn habit of finishing what I start.
          </motion.p>
        </div>
      </Beat>

      {/* ════════════ BEAT 3 — CAPABILITIES (0.40 → 0.65) ════════════ */}
      <Beat progress={p} range={[0.40, 0.44, 0.62, 0.65]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <motion.div
            style={{ opacity: useTransform(beat3P, [0, 0.12], [0, 1]) }}
            className="flex items-center gap-3 mb-6"
          >
            <StatusDot tone="coral" />
            <MonoLabel tone="coral">::CAPABILITIES · 03.03 · MANIFEST</MonoLabel>
            <span className="block w-8 h-px bg-white/15" />
            <MonoLabel>{SKILLS.length} ENTRIES</MonoLabel>
          </motion.div>

          <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] mb-3 text-center">
            Stack <span className="italic text-coral/90">manifest.</span>
          </h3>

          {/* Header strip — axis labels for the matrix below */}
          <motion.div
            style={{ opacity: useTransform(beat3P, [0.05, 0.18], [0, 1]) }}
            className="mb-6 flex items-center gap-4 font-mono-tight text-[9px] tracking-[0.35em] text-neutral-500 uppercase"
          >
            <span>◀ index</span>
            <span className="block w-12 h-px bg-white/10" />
            <span>signal · band</span>
            <span className="block w-12 h-px bg-white/10" />
            <span>module ▶</span>
          </motion.div>

          {/* Stack manifest matrix */}
          <div className="relative max-w-5xl w-full">
            <ManifestGrid pBeat={beat3P} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-3 relative z-10">
              {SKILLS.map((s, i) => (
                <SkillCard
                  key={s.label}
                  pBeat={beat3P}
                  index={i}
                  total={SKILLS.length}
                  {...s}
                />
              ))}
            </div>
          </div>

          {/* Footer telemetry strip */}
          <motion.div
            style={{ opacity: useTransform(beat3P, [0.78, 0.92], [0, 1]) }}
            className="mt-6 flex items-center gap-4 font-mono-tight text-[9px] tracking-[0.4em] text-neutral-500 uppercase"
          >
            <span className="text-mint">● SYNC</span>
            <span>12 / 12 modules loaded</span>
            <span className="text-aqua">● LIVE</span>
          </motion.div>
        </div>
      </Beat>

      {/* ════════════ BEAT 4 — ORIGIN (0.62 → 0.89) ════════════ */}
      <Beat progress={p} range={[0.62, 0.66, 0.86, 0.89]}>
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 md:px-12 pt-32 md:pt-40 pb-24">
          {/* LEFT — copy stack */}
          <motion.div
            style={{ opacity: useTransform(beat4P, [0.02, 0.22], [0, 1]) }}
            className="lg:col-span-4 flex flex-col justify-center max-w-md mx-auto lg:mx-0"
          >
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

            {/* Coord readout — vertical stack so it always fits */}
            <motion.div
              style={{ opacity: coordOpacity }}
              className="grid grid-cols-2 gap-px bg-white/10 starlog-clip border border-aqua/20"
            >
              {[
                { k: "LAT", v: "28.5355° N", tone: "lavender" },
                { k: "LON", v: "77.3910° E", tone: "lavender" },
                { k: "TZ",  v: "UTC +5:30",  tone: "aqua" },
                { k: "LOCK",v: "1.000",       tone: "mint" },
              ].map((row) => (
                <div key={row.k} className="bg-primary/85 px-3 py-2.5">
                  <div className="font-mono-tight text-[9px] tracking-[0.32em] text-neutral-500 uppercase">
                    {row.k}
                  </div>
                  <div className={`font-mono-tight text-[11px] tracking-[0.18em] mt-1 ${
                    row.tone === "aqua" ? "text-aqua"
                    : row.tone === "mint" ? "text-mint"
                    : "text-lavender"
                  }`}>
                    {row.v}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              style={{ opacity: useTransform(beat4P, [0.5, 0.75], [0, 1]) }}
              className="mt-6 flex items-center gap-3 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500 uppercase"
            >
              <span className="block w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
              <span>10 ROUTES · TRACKING</span>
            </motion.div>
          </motion.div>

          {/* RIGHT — full-bleed globe with concentric rings */}
          <div className="lg:col-span-8 relative flex items-center justify-center min-h-0">
            <motion.div
              style={{ scale: globeScale }}
              className="relative w-[min(82vmin,640px)] aspect-square"
            >
              {/* outer orbital ring (rotates slowly) */}
              <motion.div
                style={{ rotate: ringRotate }}
                className="absolute inset-[-6%] pointer-events-none"
              >
                <svg viewBox="-100 -100 200 200" className="w-full h-full">
                  <circle r="98" fill="none" stroke="rgba(122,87,219,0.22)" strokeDasharray="0.6 2" />
                  <circle r="86" fill="none" stroke="rgba(51,194,204,0.16)" />
                  {/* tick marks at compass points */}
                  {[0, 90, 180, 270].map((deg) => (
                    <g key={deg} transform={`rotate(${deg})`}>
                      <line x1="0" y1="-99" x2="0" y2="-92" stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
                    </g>
                  ))}
                  {/* compass letters */}
                  <text x="0" y="-103" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">N</text>
                  <text x="103" y="2" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">E</text>
                  <text x="0" y="108" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">S</text>
                  <text x="-103" y="2" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="4" fontFamily="Space Mono" letterSpacing="0.6">W</text>
                </svg>
              </motion.div>

              {/* the globe fills its parent */}
              <Globe className="!max-w-none" />

              {/* center crosshair — marks origin */}
              <motion.div
                style={{ opacity: useTransform(beat4P, [0.35, 0.6], [0, 0.7]) }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="w-12 h-12 border border-coral/60 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-coral shadow-[0_0_12px_#ea4884]" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-mono-tight text-[9px] tracking-[0.32em] text-coral whitespace-nowrap">
                  NOIDA · 28.5°N
                </div>
              </motion.div>

              {/* corner readouts */}
              <CornerReadout pBeat={beat4P} pos="top-2 left-2" tone="lavender" k="EPOCH" v="2026.144" />
              <CornerReadout pBeat={beat4P} pos="top-2 right-2" tone="aqua" k="HDG" v="088°" delay={0.05} />
              <CornerReadout pBeat={beat4P} pos="bottom-2 left-2" tone="mint" k="ALT" v="GEO·1" delay={0.10} />
              <CornerReadout pBeat={beat4P} pos="bottom-2 right-2" tone="coral" k="LOCK" v="1.000" delay={0.15} />
            </motion.div>
          </div>
        </div>
      </Beat>

      {/* ════════════ BEAT 5 — HANDOFF (0.86 → 1.00) ════════════ */}
      <Beat progress={p} range={[0.86, 0.90, 1.0, 1.0]}>
        <motion.div
          style={{ scale: ctaScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center"
        >
          <MonoLabel tone="lavender" className="mb-6">END · TRANSMISSION 03</MonoLabel>
          <h3 className="font-display-tight text-4xl md:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[1] mb-8 max-w-4xl">
            Want to build <span className="italic text-aqua">something</span> together?
          </h3>
          <CopyEmailButton />
          <motion.div
            style={{ scaleX: hairlineScale, transformOrigin: "center" }}
            className="mt-12 w-[min(640px,80vw)]"
          >
            <Hairline />
            <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
              <span>03 · IDENTITY</span>
              <span>↓ 04 · SERVICES</span>
            </div>
          </motion.div>
        </motion.div>
      </Beat>
    </>
  );
};

/* ---------- Beat sub-components ---------- */

const TelemetryRoll = memo(function TelemetryRoll({ pBeat, index, from, to, suffix = "", label, tone }) {
  /* All four counters fully revealed by beatP=0.55, then HOLD until fade-out */
  const start = 0.05 + index * 0.04;
  const end = 0.40 + index * 0.04;
  const counterP = useTransform(pBeat, [start, end], [0, 1], { clamp: true });
  const opacity = useTransform(pBeat, [start - 0.03, start + 0.03], [0, 1], { clamp: true });
  const y = useTransform(pBeat, [start - 0.03, start + 0.03], [40, 0], { clamp: true });
  const toneClass = {
    lavender: "text-lavender",
    aqua: "text-aqua",
    coral: "text-coral",
    mint: "text-mint",
  }[tone];
  return (
    <motion.div style={{ opacity, y }} className="border-l-2 border-lavender/40 pl-4">
      <MonoLabel tone="neutral" className="block mb-2">{label}</MonoLabel>
      <div className={`font-display-tight text-5xl md:text-6xl tracking-[-0.04em] ${toneClass}`}>
        <ScrollCounter progress={counterP} from={from} to={to} suffix={suffix} />
      </div>
    </motion.div>
  );
});

const RIPPLE_ORDER = [5, 6, 4, 7, 1, 2, 9, 10, 0, 3, 8, 11];

const SkillCard = memo(function SkillCard({
  pBeat,
  index,
  total,
  label,
  code,
  group,
  tone,
}) {
  /* Reveal completes by beatP ≈ 0.70, then HOLD until fade-out at 1.0 */
  const rank = RIPPLE_ORDER.indexOf(index);
  const start = 0.10 + (rank / total) * 0.45;
  const end = start + 0.14;

  const opacity = useTransform(pBeat, [start, end], [0, 1], { clamp: true });
  const y = useTransform(pBeat, [start, end], [24, 0], { clamp: true });
  const scale = useTransform(pBeat, [start, end], [0.9, 1], { clamp: true });
  const blur = useTransform(pBeat, [start, end], [6, 0], { clamp: true });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const scanX = useTransform(pBeat, [start, end], ["-110%", "110%"], { clamp: true });
  const scanOpacity = useTransform(
    pBeat,
    [start, start + 0.04, end - 0.04, end],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const railScaleX = useTransform(pBeat, [start, end], [0, 1], { clamp: true });

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
    <motion.div
      style={{
        opacity,
        y,
        scale,
        filter,
        transformPerspective: 800,
      }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`group relative will-change-transform overflow-hidden bg-gradient-to-b from-midnight/80 to-primary/90 border ${tokens.border} ${tokens.glow} transition-shadow duration-300 starlog-clip`}
    >
      <span className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

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
        <motion.div
          style={{ scaleX: railScaleX, transformOrigin: "left" }}
          className={`absolute inset-0 ${tokens.dot} opacity-60`}
        />
      </div>

      <motion.span
        aria-hidden
        style={{ x: scanX, opacity: scanOpacity }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </motion.div>
  );
});

const ManifestGrid = memo(function ManifestGrid({ pBeat }) {
  const opacity = useTransform(pBeat, [0.05, 0.25], [0, 0.4], { clamp: true });
  const dash = useTransform(pBeat, [0.05, 0.30], [180, 0], { clamp: true });
  return (
    <motion.svg
      aria-hidden
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 400 200"
    >
      {[0.25, 0.5, 0.75].map((y) => (
        <motion.line
          key={`h${y}`}
          x1="0"
          y1={200 * y}
          x2="400"
          y2={200 * y}
          stroke="rgba(155,128,245,0.25)"
          strokeDasharray="3 5"
          strokeDashoffset={dash}
        />
      ))}
      {[0.33, 0.66].map((x) => (
        <motion.line
          key={`v${x}`}
          x1={400 * x}
          y1="0"
          x2={400 * x}
          y2="200"
          stroke="rgba(51,194,204,0.18)"
          strokeDasharray="3 5"
          strokeDashoffset={dash}
        />
      ))}
    </motion.svg>
  );
});

const CornerReadout = memo(function CornerReadout({ pBeat, pos, tone, k, v, delay = 0 }) {
  const opacity = useTransform(pBeat, [0.25 + delay, 0.45 + delay], [0, 1], { clamp: true });
  const toneClass = {
    lavender: "text-lavender border-lavender/30",
    aqua: "text-aqua border-aqua/30",
    coral: "text-coral border-coral/30",
    mint: "text-mint border-mint/30",
  }[tone];
  return (
    <motion.div
      style={{ opacity }}
      className={`absolute ${pos} hidden md:flex items-center gap-2 px-2 py-1 bg-primary/80 backdrop-blur-sm border ${toneClass} font-mono-tight text-[9px] tracking-[0.25em]`}
    >
      <span className="text-neutral-500">{k}</span>
      <span className="block w-px h-2.5 bg-white/15" />
      <span>{v}</span>
    </motion.div>
  );
});

export default memo(About);
