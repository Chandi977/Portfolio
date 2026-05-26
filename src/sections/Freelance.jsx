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
   280vh pinned. Four beats:
     1) INTRO     0.00 → 0.14
     2) DECK      0.14 → 0.62   — 3 cards step into a fixed center slot
     3) WORKFLOW  0.62 → 0.86   — 4-step engagement diagram draws across
     4) STATUS    0.86 → 1.00   — availability strip + CTA
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
    height={360}
    beatLabels={["INTRO", "DECK", "WORKFLOW", "STATUS"]}
  >
    {(p) => <FreelanceBeats p={p} />}
  </PinnedStage>
);

/* Beat windows (parent progress 0→1)
   INTRO    0.00 → 0.14
   DECK     0.14 → 0.62   (48% of scroll — 3 stepped cards)
   WORKFLOW 0.62 → 0.86
   STATUS   0.86 → 1.00
   Each beat's sub-progress range matches its peak window exactly. */
const FreelanceBeats = ({ p }) => {
  // Sub-progress completes ~70% through each beat's peak window so reveals
  // finish with dwell time before the cross-fade to the next beat.
  // Beat ranges share their fade boundaries (peakEnd of one = fadeInStart of
  // the next) so beats cross-fade smoothly without a blank gap.
  const beat1P = useSubProgress(p, 0.00, 0.10);
  const deckP  = useSubProgress(p, 0.22, 0.58);
  const beat3P = useSubProgress(p, 0.66, 0.82);
  const beat4P = useSubProgress(p, 0.88, 0.97);

  return (
    <>
      {/* ════════ BEAT 1 — INTRO ════════ */}
      <Beat progress={p} range={[0, 0, 0.16, 0.22]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="mint" />
            <MonoLabel tone="mint">ACCEPTING · Q2 / 2026</MonoLabel>
            <span className="block w-6 h-px bg-white/20" />
            <MonoLabel tone="aqua">::PIPELINE · OPEN</MonoLabel>
          </div>
          <h2 className="font-display-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={beat1P}
              text="Available for selected freelance work — ship-grade systems, end to end."
              revealWindow={0.85}
            />
          </h2>
          <FadeIn progress={beat1P} start={0.55} end={0.75}>
            <p className="mt-8 text-neutral-400 max-w-2xl font-display-tight italic">
              Three engagement modes. Scroll to step through each one.
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* ════════ BEAT 2 — DECK (stepped horizontal) ════════ */}
      <Beat progress={p} range={[0.16, 0.22, 0.62, 0.68]}>
        <DeckBeat deckP={deckP} />
      </Beat>

      {/* ════════ BEAT 3 — WORKFLOW DIAGRAM ════════ */}
      <Beat progress={p} range={[0.62, 0.68, 0.84, 0.90]}>
        <WorkflowBeat beat3P={beat3P} />
      </Beat>

      {/* ════════ BEAT 4 — STATUS + CTA ════════ */}
      <Beat progress={p} range={[0.84, 0.90, 1.0, 1.0]}>
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

/* ---------- useCardSpacing — resize-aware, returns px between card centers ---------- */
function useCardSpacing() {
  const [spacing, setSpacing] = useState(() =>
    typeof window === "undefined" ? 540 : computeSpacing(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => setSpacing(computeSpacing(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return spacing;
}
function computeSpacing(vw) {
  // card width: min(420, 0.82·vw); spacing = cardWidth + breathing gap
  const cardW = Math.min(420, vw * 0.82);
  const gap = vw >= 768 ? 120 : vw * 0.18;
  return cardW + gap;
}

/* ---------- DeckBeat ---------- */
const DeckBeat = memo(function DeckBeat({ deckP }) {
  const spacing = useCardSpacing();

  return (
    <div className="absolute inset-0">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        <StatusDot tone="aqua" />
        <MonoLabel tone="aqua">::SERVICES · 04.02 · 3 MODULES</MonoLabel>
      </div>

      {/* Centered frame — viewport-fixed target slot for the active card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="w-[min(420px,82vw)] h-[min(540px,72vh)] border border-lavender/15" />
      </div>

      {/* Each card positions itself relative to the active index */}
      {freelanceServices.map((s, i) => (
        <ServiceCard
          key={s.title}
          service={s}
          index={i}
          total={freelanceServices.length}
          spacing={spacing}
          pDeck={deckP}
        />
      ))}

      <CardCounter pDeck={deckP} />
    </div>
  );
});

/* ---------- ServiceCard ----------
   Each card self-centers via translate(-50%, -50%) and offsets horizontally
   by its distance from the current active card (in px). Continuous
   activeFloat ∈ [0, total-1] lets adjacent cards slide smoothly. */
const ServiceCard = memo(function ServiceCard({ service, index, total, spacing, pDeck }) {
  const ref = useRef(null);
  const last = Math.max(1, total - 1);

  useEffect(() => {
    if (!pDeck) return;
    return pDeck.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      const activeFloat = p * last;                  // 0 → total-1
      const distance = index - activeFloat;          // signed slots from center
      const absDist = Math.min(1, Math.abs(distance));
      const scale = interpolate(absDist, [0, 1], [1.02, 0.78]);
      const opacity = interpolate(absDist, [0, 1], [1, 0.3]);
      const blur = interpolate(absDist, [0, 1], [0, 4]);
      el.style.transform = `translate(-50%, -50%) translateX(${distance * spacing}px) scale(${scale})`;
      el.style.opacity = opacity;
      el.style.filter = `blur(${blur}px)`;
    });
  }, [pDeck, index, last, spacing]);

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
      style={{
        willChange: "transform, opacity, filter",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 20 - index,
      }}
      className={`w-[min(420px,82vw)] h-[min(540px,72vh)] starlog-clip border ${toneClasses.border} bg-gradient-to-b ${toneClasses.bg} to-primary p-7 md:p-8 flex flex-col`}
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
        <MonoLabel>AVAILABLE</MonoLabel>
        <MonoLabel tone={tone}>↗ HIRE</MonoLabel>
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
      setV(Math.min(3, Math.max(1, Math.round(p * 2) + 1)));
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
      if (headerRef.current) headerRef.current.style.opacity = interpolate(p, [0, 0.12], [0, 1]);
      // Line and note complete well before sub=1.0 so the diagram dwells before fading.
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${interpolate(p, [0.05, 0.55], [0, 1])})`;
      if (noteRef.current) noteRef.current.style.opacity = interpolate(p, [0.55, 0.70], [0, 1]);
    });
  }, [beat3P]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
      <div ref={headerRef} style={{ opacity: 0 }} className="flex items-center gap-3 mb-8">
        <StatusDot tone="coral" />
        <MonoLabel tone="coral">::PROJECT · WORKFLOW</MonoLabel>
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
        ◇ AGILE SPRINTS · WORKING CODE · CONTINUOUS DEPLOY
      </p>
    </div>
  );
});

/* ---------- WorkflowNode ---------- */
const WorkflowNode = memo(function WorkflowNode({ step, index, pBeat }) {
  const ref = useRef(null);
  const dotRef = useRef(null);
  // Tighter cascade: last node lands at sub-progress ~0.55 (was ~0.75)
  const start = 0.10 + index * 0.12;
  const end = start + 0.10;

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
        gridRef.current.style.transform = `scaleY(${interpolate(p, [0, 0.35], [0, 1])})`;
      }
      if (ctaRef.current) ctaRef.current.style.opacity = interpolate(p, [0.35, 0.65], [0, 1]);
      if (hairRef.current) {
        hairRef.current.style.transform = `scaleX(${interpolate(p, [0.50, 0.80], [0, 1])})`;
      }
    });
  }, [beat4P]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
      <MonoLabel tone="mint" className="mb-6">END · MODULE 04</MonoLabel>

      <h3 className="font-display-tight text-3xl md:text-5xl text-white tracking-[-0.035em] text-center max-w-3xl mb-10">
        Availability and engagement models.
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
