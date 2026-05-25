import { memo, useState, useEffect } from "react";
import { motion, useTransform } from "motion/react";
import CopyEmailButton from "../components/CopyEmailButton";
import { freelanceDetails, freelanceServices } from "../constants";
import {
  PinnedStage,
  Beat,
  WordReveal,
  MonoLabel,
  StatusDot,
  Hairline,
} from "../components/starlog/ds";

/* ============================================================
   TRANSMISSION 04 // SERVICES
   360vh pinned. Four beats:
     1) INTRO     0.00 → 0.16   — title sentence reveals
     2) DECK      0.16 → 0.62   — 3 service modules travel horizontally
     3) WORKFLOW  0.62 → 0.88   — 4-step engagement diagram draws across
     4) STATUS    0.88 → 1.00   — availability strip + CTA
   ============================================================ */

const WORKFLOW = [
  { code: "01", label: "DISCOVER", desc: "Goals, constraints, scope" },
  { code: "02", label: "SCOPE", desc: "Milestones, contracts, risks" },
  { code: "03", label: "BUILD", desc: "Sprints, demos, iteration" },
  { code: "04", label: "SHIP", desc: "Deploy, harden, handoff" },
];

const Freelance = () => (
  <PinnedStage
    id="freelance"
    index="04"
    callsign="SERVICES"
    tone="aqua"
    height={380}
    beatLabels={["INTRO", "DECK", "WORKFLOW", "STATUS"]}
  >
    {(p) => <FreelanceBeats p={p} />}
  </PinnedStage>
);

const FreelanceBeats = ({ p }) => {
  /* Internal beat progresses are mapped to the PEAK window only, so all
     content fully resolves while the beat is at full opacity. */
  const beat1P = useTransform(p, [0.00, 0.13], [0, 1], { clamp: true });
  const deckP  = useTransform(p, [0.20, 0.60], [0, 1], { clamp: true });
  const deckX  = useTransform(deckP, [0, 1], ["20vw", "-80vw"]);
  const beat3P = useTransform(p, [0.66, 0.84], [0, 1], { clamp: true });
  const beat4P = useTransform(p, [0.90, 0.99], [0, 1], { clamp: true });

  return (
    <>
      {/* ════════ BEAT 1 — INTRO ════════ */}
      <Beat progress={p} range={[0, 0, 0.16, 0.19]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="mint" />
            <MonoLabel tone="mint">ACCEPTING · Q2 / 2026</MonoLabel>
            <span className="block w-6 h-px bg-white/20" />
            <MonoLabel tone="aqua">::CHANNEL · OPEN</MonoLabel>
          </div>
          <h2 className="font-display-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={beat1P}
              text="Available for selected freelance work — ship-grade systems, end to end."
              revealWindow={0.85}
            />
          </h2>
          <motion.p
            style={{ opacity: useTransform(beat1P, [0.7, 1], [0, 1]) }}
            className="mt-8 text-neutral-400 max-w-2xl font-display-tight italic"
          >
            Three ways to bring me in. Scroll to see them slide through.
          </motion.p>
        </div>
      </Beat>

      {/* ════════ BEAT 2 — DECK (horizontal travel) ════════ */}
      <Beat progress={p} range={[0.16, 0.20, 0.62, 0.65]}>
        <div className="absolute inset-0 flex flex-col">
          {/* Persistent label band */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
            <StatusDot tone="aqua" />
            <MonoLabel tone="aqua">::DECK · 04.02 · 3 MODULES</MonoLabel>
          </div>

          {/* Card strip — translates with scroll */}
          <motion.div
            style={{ x: deckX }}
            className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center gap-8 md:gap-12 lg:gap-20 pl-[10vw] will-change-transform"
          >
            {freelanceServices.map((s, i) => (
              <ServiceCard key={s.title} service={s} index={i} total={freelanceServices.length} pDeck={deckP} />
            ))}
          </motion.div>

          {/* Center crosshair indicating "active card" zone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="w-[min(420px,82vw)] h-[min(540px,72vh)] border border-lavender/15" />
          </div>

          {/* Card counter (bottom-left) */}
          <CardCounter pDeck={deckP} />
        </div>
      </Beat>

      {/* ════════ BEAT 3 — WORKFLOW DIAGRAM ════════ */}
      <Beat progress={p} range={[0.62, 0.66, 0.86, 0.89]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <motion.div
            style={{ opacity: useTransform(beat3P, [0, 0.15], [0, 1]) }}
            className="flex items-center gap-3 mb-8"
          >
            <StatusDot tone="coral" />
            <MonoLabel tone="coral">::ENGAGEMENT · WORKFLOW</MonoLabel>
          </motion.div>

          <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] mb-14 text-center">
            How it goes when we work together.
          </h3>

          <div className="relative w-full max-w-5xl">
            {/* Connecting line */}
            <div className="absolute top-7 left-0 right-0 h-px bg-white/10 hidden md:block">
              <motion.div
                style={{ scaleX: useTransform(beat3P, [0.1, 0.85], [0, 1]) }}
                className="origin-left h-full bg-gradient-to-r from-lavender via-aqua to-coral"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {WORKFLOW.map((step, i) => (
                <WorkflowNode key={step.code} step={step} index={i} pBeat={beat3P} />
              ))}
            </div>
          </div>

          <motion.p
            style={{ opacity: useTransform(beat3P, [0.7, 1], [0, 1]) }}
            className="mt-14 text-center text-neutral-500 font-mono-tight text-xs tracking-[0.32em] uppercase"
          >
            ◇ NO LONG SALES CYCLES · NO SLIDEWARE
          </motion.p>
        </div>
      </Beat>

      {/* ════════ BEAT 4 — STATUS + CTA ════════ */}
      <Beat progress={p} range={[0.86, 0.90, 1.0, 1.0]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <MonoLabel tone="mint" className="mb-6">END · TRANSMISSION 04</MonoLabel>

          <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] text-center max-w-3xl mb-10">
            Three statuses, one channel.
          </h3>

          <motion.div
            style={{ scaleY: useTransform(beat4P, [0, 0.5], [0, 1]), transformOrigin: "top" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 max-w-4xl w-full"
          >
            {freelanceDetails.map((d, i) => (
              <div key={d.label} className="bg-primary p-5 md:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono-tight text-[10px] tracking-[0.25em] text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <MonoLabel>{d.label}</MonoLabel>
                </div>
                <div className="font-display-tight text-xl md:text-2xl text-white tracking-[-0.02em]">
                  {d.value}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            style={{ opacity: useTransform(beat4P, [0.5, 1], [0, 1]) }}
            className="mt-10"
          >
            <CopyEmailButton />
          </motion.div>

          <motion.div
            style={{ scaleX: useTransform(beat4P, [0.5, 1], [0, 1]), transformOrigin: "center" }}
            className="mt-12 w-[min(640px,80vw)]"
          >
            <Hairline />
            <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
              <span>04 · SERVICES</span>
              <span>↓ 05 · DEPLOYMENTS</span>
            </div>
          </motion.div>
        </div>
      </Beat>
    </>
  );
};

/* ---------- Service card with scroll-driven scale/tilt ---------- */
const ServiceCard = memo(function ServiceCard({ service, index, total, pDeck }) {
  // Each card is "centered" at progress = (i + 0.5) / total
  const center = (index + 0.5) / total;
  // Use distance from center to drive scale and dim
  const scale = useTransform(pDeck, [center - 0.4, center, center + 0.4], [0.78, 1.02, 0.78]);
  const opacity = useTransform(pDeck, [center - 0.4, center, center + 0.4], [0.35, 1, 0.35]);
  const blur = useTransform(pDeck, [center - 0.4, center, center + 0.4], [4, 0, 4]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  const tones = ["lavender", "aqua", "coral"];
  const tone = tones[index % 3];
  const toneClasses = {
    lavender: { border: "border-lavender/40", text: "text-lavender", bg: "from-lavender/5" },
    aqua: { border: "border-aqua/40", text: "text-aqua", bg: "from-aqua/5" },
    coral: { border: "border-coral/40", text: "text-coral", bg: "from-coral/5" },
  }[tone];

  return (
    <motion.article
      style={{ scale, opacity, filter }}
      className={`relative shrink-0 w-[min(420px,82vw)] h-[min(540px,72vh)] starlog-clip border ${toneClasses.border} bg-gradient-to-b ${toneClasses.bg} to-primary p-7 md:p-8 flex flex-col will-change-transform`}
    >
      {/* Corner brackets */}
      <span className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${toneClasses.border}`} />
      <span className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${toneClasses.border}`} />
      <span className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${toneClasses.border}`} />
      <span className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${toneClasses.border}`} />

      <div className="flex items-center justify-between mb-6">
        <span className={`font-display-tight text-5xl ${toneClasses.text} tracking-[-0.04em]`}>
          0{index + 1}
        </span>
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <MonoLabel tone={tone}>MOD · 04.0{index + 1}</MonoLabel>
        </div>
      </div>

      <h3 className="font-display-tight text-2xl md:text-3xl text-white tracking-[-0.03em] mb-4">
        {service.title}
      </h3>
      <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6">
        {service.description}
      </p>

      <ul className="space-y-3 mt-auto pt-5 border-t border-white/10">
        {service.points.map((point, i) => (
          <li key={point} className="flex items-start gap-3 font-mono-tight text-[12px] text-neutral-300">
            <span className={`${toneClasses.text} mt-[2px] flex items-center gap-1`}>
              <span className="text-[8px] opacity-50">{String(i + 1).padStart(2, "0")}</span>
              <span>→</span>
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <MonoLabel>READY</MonoLabel>
        <MonoLabel tone={tone}>↗ ENGAGE</MonoLabel>
      </div>
    </motion.article>
  );
});

const CardCounter = memo(function CardCounter({ pDeck }) {
  // Translate progress 0..1 → index 1..3 then floor
  const idx = useTransform(pDeck, (v) => Math.min(3, Math.max(1, Math.floor(v * 3) + 1)));
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4">
      <MonoLabel>NOW VIEWING</MonoLabel>
      <motion.div className="font-display-tight text-3xl text-lavender tabular-nums">
        <CounterChild mv={idx} />
      </motion.div>
      <span className="text-neutral-500 font-mono-tight">/ 03</span>
    </div>
  );
});

const CounterChild = memo(function CounterChild({ mv }) {
  // Render the raw value
  const [v, setV] = useState(1);
  useEffect(() => mv.on("change", setV), [mv]);
  return <>{String(v).padStart(2, "0")}</>;
});

const WorkflowNode = memo(function WorkflowNode({ step, index, pBeat }) {
  const start = 0.15 + index * 0.16;
  const end = start + 0.12;
  const opacity = useTransform(pBeat, [start, end], [0, 1], { clamp: true });
  const y = useTransform(pBeat, [start, end], [20, 0], { clamp: true });
  const dotScale = useTransform(pBeat, [start, end], [0, 1], { clamp: true });
  const tones = ["lavender", "aqua", "mint", "coral"];
  const tone = tones[index % 4];
  const toneClass = {
    lavender: "text-lavender bg-lavender",
    aqua: "text-aqua bg-aqua",
    mint: "text-mint bg-mint",
    coral: "text-coral bg-coral",
  }[tone];
  const [textC, bgC] = toneClass.split(" ");

  return (
    <motion.div style={{ opacity, y }} className="flex flex-col items-center text-center">
      <motion.span
        style={{ scale: dotScale }}
        className={`relative w-4 h-4 rounded-full ${bgC} z-10 ring-4 ring-primary`}
      >
        <span className={`absolute inset-0 rounded-full ${bgC} opacity-30 animate-ping`} />
      </motion.span>
      <span className={`mt-5 font-mono-tight text-[10px] tracking-[0.3em] ${textC}`}>
        {step.code}
      </span>
      <h4 className="mt-1 font-display-tight text-xl md:text-2xl text-white tracking-[-0.02em]">
        {step.label}
      </h4>
      <p className="mt-2 text-xs md:text-sm text-neutral-400 max-w-[140px]">{step.desc}</p>
    </motion.div>
  );
});

export default memo(Freelance);
