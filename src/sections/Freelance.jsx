import { memo, useState, useEffect, useRef } from "react";
import CopyEmailButton from "../components/CopyEmailButton";
import { freelanceDetails, freelanceServices } from "../constants";
import {
  PinnedStage,
  Beat,
  WordReveal,
  MonoLabel,
  StatusDot,
  Hairline,
  useSubProgress,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

/* ============================================================
   TRANSMISSION 04 // SERVICES
   360vh pinned. Four beats:
     1) INTRO     0.00 → 0.16
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
  const beat1P = useSubProgress(p, 0.00, 0.13);
  const deckP  = useSubProgress(p, 0.20, 0.60);
  const beat3P = useSubProgress(p, 0.66, 0.84);
  const beat4P = useSubProgress(p, 0.90, 0.99);

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
          <FadeIn progress={beat1P} start={0.7} end={1}>
            <p className="mt-8 text-neutral-400 max-w-2xl font-display-tight italic">
              Three ways to bring me in. Scroll to see them slide through.
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* ════════ BEAT 2 — DECK (horizontal travel) ════════ */}
      <Beat progress={p} range={[0.16, 0.20, 0.62, 0.65]}>
        <DeckBeat deckP={deckP} />
      </Beat>

      {/* ════════ BEAT 3 — WORKFLOW DIAGRAM ════════ */}
      <Beat progress={p} range={[0.62, 0.66, 0.86, 0.89]}>
        <WorkflowBeat beat3P={beat3P} />
      </Beat>

      {/* ════════ BEAT 4 — STATUS + CTA ════════ */}
      <Beat progress={p} range={[0.86, 0.90, 1.0, 1.0]}>
        <StatusBeat beat4P={beat4P} />
      </Beat>
    </>
  );
};

/* ---------- FadeIn ---------- */
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

/* ---------- DeckBeat ---------- */
const DeckBeat = memo(function DeckBeat({ deckP }) {
  const stripRef = useRef(null);

  useEffect(() => {
    if (!deckP) return;
    return deckP.onChange((p) => {
      if (stripRef.current) {
        // Travel from 20vw to -80vw
        const x = interpolate(p, [0, 1], [20, -80]);
        stripRef.current.style.transform = `translateY(-50%) translateX(${x}vw)`;
      }
    });
  }, [deckP]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        <StatusDot tone="aqua" />
        <MonoLabel tone="aqua">::DECK · 04.02 · 3 MODULES</MonoLabel>
      </div>

      <div
        ref={stripRef}
        className="absolute top-1/2 left-0 flex items-center gap-8 md:gap-12 lg:gap-20 pl-[10vw]"
        style={{ transform: "translateY(-50%)", willChange: "transform" }}
      >
        {freelanceServices.map((s, i) => (
          <ServiceCard key={s.title} service={s} index={i} total={freelanceServices.length} pDeck={deckP} />
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-[min(420px,82vw)] h-[min(540px,72vh)] border border-lavender/15" />
      </div>

      <CardCounter pDeck={deckP} />
    </div>
  );
});

/* ---------- ServiceCard ---------- */
const ServiceCard = memo(function ServiceCard({ service, index, total, pDeck }) {
  const ref = useRef(null);
  const center = (index + 0.5) / total;

  useEffect(() => {
    if (!pDeck) return;
    return pDeck.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      const scale = interpolate(p, [center - 0.4, center, center + 0.4], [0.78, 1.02, 0.78]);
      const opacity = interpolate(p, [center - 0.4, center, center + 0.4], [0.35, 1, 0.35]);
      const blur = interpolate(p, [center - 0.4, center, center + 0.4], [4, 0, 4]);
      el.style.transform = `scale(${scale})`;
      el.style.opacity = opacity;
      el.style.filter = `blur(${blur}px)`;
    });
  }, [pDeck, center]);

  const tones = ["lavender", "aqua", "coral"];
  const tone = tones[index % 3];
  const toneClasses = {
    lavender: { border: "border-lavender/40", text: "text-lavender", bg: "from-lavender/5" },
    aqua: { border: "border-aqua/40", text: "text-aqua", bg: "from-aqua/5" },
    coral: { border: "border-coral/40", text: "text-coral", bg: "from-coral/5" },
  }[tone];

  return (
    <article
      ref={ref}
      style={{ willChange: "transform, opacity, filter" }}
      className={`relative shrink-0 w-[min(420px,82vw)] h-[min(540px,72vh)] starlog-clip border ${toneClasses.border} bg-gradient-to-b ${toneClasses.bg} to-primary p-7 md:p-8 flex flex-col`}
    >
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
    </article>
  );
});

/* ---------- CardCounter ---------- */
const CardCounter = memo(function CardCounter({ pDeck }) {
  const [v, setV] = useState(1);
  useEffect(() => {
    if (!pDeck) return;
    return pDeck.onChange((p) => {
      setV(Math.min(3, Math.max(1, Math.floor(p * 3) + 1)));
    });
  }, [pDeck]);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4">
      <MonoLabel>NOW VIEWING</MonoLabel>
      <span className="font-display-tight text-3xl text-lavender tabular-nums">
        {String(v).padStart(2, "0")}
      </span>
      <span className="text-neutral-500 font-mono-tight">/ 03</span>
    </div>
  );
});

/* ---------- WorkflowBeat ---------- */
const WorkflowBeat = memo(function WorkflowBeat({ beat3P }) {
  const lineRef = useRef(null);
  const noteRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!beat3P) return;
    return beat3P.onChange((p) => {
      if (headerRef.current) headerRef.current.style.opacity = interpolate(p, [0, 0.15], [0, 1]);
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${interpolate(p, [0.1, 0.85], [0, 1])})`;
      if (noteRef.current) noteRef.current.style.opacity = interpolate(p, [0.7, 1], [0, 1]);
    });
  }, [beat3P]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
      <div ref={headerRef} style={{ opacity: 0 }} className="flex items-center gap-3 mb-8">
        <StatusDot tone="coral" />
        <MonoLabel tone="coral">::ENGAGEMENT · WORKFLOW</MonoLabel>
      </div>

      <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] mb-14 text-center">
        How it goes when we work together.
      </h3>

      <div className="relative w-full max-w-5xl">
        <div className="absolute top-7 left-0 right-0 h-px bg-white/10 hidden md:block">
          <div
            ref={lineRef}
            style={{ transformOrigin: "left", transform: "scaleX(0)" }}
            className="origin-left h-full bg-gradient-to-r from-lavender via-aqua to-coral"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {WORKFLOW.map((step, i) => (
            <WorkflowNode key={step.code} step={step} index={i} pBeat={beat3P} />
          ))}
        </div>
      </div>

      <p ref={noteRef} style={{ opacity: 0 }} className="mt-14 text-center text-neutral-500 font-mono-tight text-xs tracking-[0.32em] uppercase">
        ◇ NO LONG SALES CYCLES · NO SLIDEWARE
      </p>
    </div>
  );
});

/* ---------- WorkflowNode ---------- */
const WorkflowNode = memo(function WorkflowNode({ step, index, pBeat }) {
  const ref = useRef(null);
  const dotRef = useRef(null);
  const start = 0.15 + index * 0.16;
  const end = start + 0.12;

  useEffect(() => {
    if (!pBeat) return;
    return pBeat.onChange((p) => {
      const el = ref.current;
      if (el) {
        el.style.opacity = interpolate(p, [start, end], [0, 1]);
        el.style.transform = `translateY(${interpolate(p, [start, end], [20, 0])}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `scale(${interpolate(p, [start, end], [0, 1])})`;
      }
    });
  }, [pBeat, start, end]);

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
    <div ref={ref} style={{ opacity: 0, willChange: "transform" }} className="flex flex-col items-center text-center">
      <span
        ref={dotRef}
        style={{ transform: "scale(0)" }}
        className={`relative w-4 h-4 rounded-full ${bgC} z-10 ring-4 ring-primary`}
      >
        <span className={`absolute inset-0 rounded-full ${bgC} opacity-30 animate-ping`} />
      </span>
      <span className={`mt-5 font-mono-tight text-[10px] tracking-[0.3em] ${textC}`}>
        {step.code}
      </span>
      <h4 className="mt-1 font-display-tight text-xl md:text-2xl text-white tracking-[-0.02em]">
        {step.label}
      </h4>
      <p className="mt-2 text-xs md:text-sm text-neutral-400 max-w-[140px]">{step.desc}</p>
    </div>
  );
});

/* ---------- StatusBeat ---------- */
const StatusBeat = memo(function StatusBeat({ beat4P }) {
  const gridRef = useRef(null);
  const ctaRef = useRef(null);
  const hairRef = useRef(null);

  useEffect(() => {
    if (!beat4P) return;
    return beat4P.onChange((p) => {
      if (gridRef.current) {
        gridRef.current.style.transform = `scaleY(${interpolate(p, [0, 0.5], [0, 1])})`;
      }
      if (ctaRef.current) ctaRef.current.style.opacity = interpolate(p, [0.5, 1], [0, 1]);
      if (hairRef.current) {
        hairRef.current.style.transform = `scaleX(${interpolate(p, [0.5, 1], [0, 1])})`;
      }
    });
  }, [beat4P]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
      <MonoLabel tone="mint" className="mb-6">END · TRANSMISSION 04</MonoLabel>

      <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] text-center max-w-3xl mb-10">
        Three statuses, one channel.
      </h3>

      <div
        ref={gridRef}
        style={{ transformOrigin: "top", transform: "scaleY(0)" }}
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
      </div>

      <div ref={ctaRef} style={{ opacity: 0 }} className="mt-10">
        <CopyEmailButton />
      </div>

      <div ref={hairRef} style={{ transformOrigin: "center", transform: "scaleX(0)" }} className="mt-12 w-[min(640px,80vw)]">
        <Hairline />
        <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          <span>04 · SERVICES</span>
          <span>↓ 05 · DEPLOYMENTS</span>
        </div>
      </div>
    </div>
  );
});

export default memo(Freelance);
