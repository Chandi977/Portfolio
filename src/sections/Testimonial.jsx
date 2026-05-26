import { memo, useRef, useEffect } from "react";
import { reviews } from "../constants";
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
   TRANSMISSION 07 // INTERCEPTS
   320vh pinned. Three beats:
     1) INCOMING  0.00 → 0.15
     2) FEED      0.15 → 0.85  — marquees driven by scroll
     3) SIGNOFF   0.85 → 1.00
   ============================================================ */

const Testimonial = () => (
  <PinnedStage
    id="testimonial"
    index="07"
    callsign="REVIEWS"
    tone="coral"
    height={320}
    beatLabels={["INTRO", "FEED", "OUTRO"]}
  >
    {(p) => <TestimonialBeats p={p} />}
  </PinnedStage>
);

const TestimonialBeats = ({ p }) => {
  // Sub-progress ranges complete before each beat's fade-out so reveals
  // finish with dwell time on screen.
  const introP = useSubProgress(p, 0, 0.11);
  const feedP = useSubProgress(p, 0.18, 0.82);
  const outroP = useSubProgress(p, 0.87, 0.98);

  const firstHalf = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondHalf = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <>
      {/* ════ BEAT 1 — INCOMING ════ */}
      <Beat progress={p} range={[0, 0, 0.15, 0.20]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="coral" />
            <MonoLabel tone="coral">::REVIEWS · {reviews.length} RECEIVED</MonoLabel>
            <span className="block w-6 h-px bg-white/20" />
            <MonoLabel tone="aqua">STREAM · LIVE</MonoLabel>
          </div>
          <h2 className="font-display-tight italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={introP}
              text="Notes from devs and teams I've built with."
              revealWindow={0.85}
            />
          </h2>
          <FadeIn progress={introP} start={0.55} end={0.72}>
            <p className="mt-10 font-mono-tight text-xs tracking-[0.4em] text-coral/80 uppercase">
              ↓ SCROLL TO READ REVIEWS
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* ════ BEAT 2 — FEED (scroll-driven) ════ */}
      <Beat progress={p} range={[0.15, 0.20, 0.84, 0.89]}>
        <div className="absolute inset-0 flex flex-col justify-center">
          {/* Header tag */}
          <FadeIn progress={feedP} start={0} end={0.1}>
            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
              <StatusDot tone="aqua" />
              <MonoLabel tone="aqua">::FEED · LIVE</MonoLabel>
            </div>
          </FadeIn>

          {/* Band A */}
          <div className="relative mb-6 md:mb-10">
            <div className="flex items-center gap-4 mb-3 px-6">
              <MonoLabel tone="coral">▼ STREAM · A · FEATURED</MonoLabel>
              <span className="flex-1 h-px bg-coral/20" />
              <MonoLabel>{firstHalf.length} REVIEWS</MonoLabel>
            </div>
            <div className="relative overflow-hidden">
              <BandStrip items={firstHalf} feedP={feedP} direction={1} band="A" />
            </div>
          </div>

          {/* Band B (counter-direction) */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-3 px-6">
              <MonoLabel tone="aqua">▲ STREAM · B · ADDITIONAL</MonoLabel>
              <span className="flex-1 h-px bg-aqua/20" />
              <MonoLabel>{secondHalf.length} REVIEWS</MonoLabel>
            </div>
            <div className="relative overflow-hidden">
              <BandStrip items={secondHalf} feedP={feedP} direction={-1} band="B" />
            </div>
          </div>

          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 pointer-events-none bg-gradient-to-r from-primary to-transparent z-20" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 pointer-events-none bg-gradient-to-l from-primary to-transparent z-20" />

          {/* Central scanline */}
          <div
            aria-hidden
            className="absolute left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-coral/30 to-transparent pointer-events-none z-30"
          />
        </div>
      </Beat>

      {/* ════ BEAT 3 — SIGNOFF ════ */}
      <Beat progress={p} range={[0.86, 0.91, 1.0, 1.0]}>
        <SignoffBeat outroP={outroP} />
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

/* ---------- BandStrip ---------- */
const BandStrip = memo(function BandStrip({ items, feedP, direction, band }) {
  const stripRef = useRef(null);

  useEffect(() => {
    if (!feedP) return;
    return feedP.onChange((p) => {
      if (!stripRef.current) return;
      const x = direction > 0
        ? interpolate(p, [0, 1], [10, -110])
        : interpolate(p, [0, 1], [-110, 10]);
      stripRef.current.style.transform = `translateX(${x}%)`;
    });
  }, [feedP, direction]);

  return (
    <div
      ref={stripRef}
      className="flex gap-5 will-change-transform"
      style={{ willChange: "transform" }}
    >
      {items.map((r, i) => (
        <InterceptCard key={r.username} review={r} index={i} feedP={feedP} band={band} />
      ))}
    </div>
  );
});

/* ---------- InterceptCard ---------- */
const InterceptCard = memo(function InterceptCard({ review, index, feedP, band }) {
  const glowRef = useRef(null);

  const cardWidth = 0.06;
  const baseShift = band === "A" ? 0.12 : 0.06;
  const slot = baseShift + index * cardWidth;

  useEffect(() => {
    if (!feedP || !glowRef.current) return;
    return feedP.onChange((p) => {
      const glow = interpolate(
        p,
        [slot - cardWidth / 2, slot, slot + cardWidth / 2],
        [0, 1, 0]
      );
      glowRef.current.style.opacity = glow;
    });
  }, [feedP, slot, cardWidth]);

  const tone = ["lavender", "aqua", "coral", "mint"][index % 4];
  const toneClasses = {
    lavender: { border: "border-lavender/30", text: "text-lavender", glow: "shadow-[0_0_30px_-10px_rgba(122,87,219,0.7)]" },
    aqua: { border: "border-aqua/30", text: "text-aqua", glow: "shadow-[0_0_30px_-10px_rgba(51,194,204,0.7)]" },
    coral: { border: "border-coral/30", text: "text-coral", glow: "shadow-[0_0_30px_-10px_rgba(234,72,132,0.7)]" },
    mint: { border: "border-mint/30", text: "text-mint", glow: "shadow-[0_0_30px_-10px_rgba(87,219,150,0.7)]" },
  }[tone];

  const buildId = `v${(1 + index * 0.1).toFixed(1)}.${String(index).padStart(2, "0")}`;

  return (
    <figure
      className={`relative shrink-0 w-72 h-auto starlog-clip border ${toneClasses.border} bg-gradient-to-b from-midnight/85 to-primary/85 px-4 py-4 ${toneClasses.glow}`}
    >
      {/* Capture scanline overlay */}
      <div
        ref={glowRef}
        aria-hidden
        style={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-white/[0.08]" />
      </div>

      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <span className={`font-mono-tight text-[10px] tracking-[0.22em] ${toneClasses.text}`}>
            {buildId}
          </span>
        </div>
        <span className="font-mono-tight text-[9px] tracking-[0.3em] text-neutral-500">▌▌▌</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={review.img}
            alt=""
            width="36"
            height="36"
            className="rounded-full border border-white/10 bg-white/5"
            loading="lazy"
            decoding="async"
          />
          <span className={`absolute -bottom-0.5 -right-0.5 block w-2 h-2 rounded-full ${toneClasses.text.replace("text-", "bg-")}`} />
        </div>
        <div className="flex flex-col leading-tight">
          <figcaption className="text-sm font-semibold text-white">{review.name}</figcaption>
          <span className="font-mono-tight text-[10px] tracking-[0.18em] text-white/40">
            {review.username}
          </span>
        </div>
      </div>

      <blockquote className="mt-3 text-sm text-neutral-200 leading-relaxed font-display-tight">
        <span className={toneClasses.text}>"</span>
        {review.body}
        <span className={toneClasses.text}>"</span>
      </blockquote>

      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="font-mono-tight text-[9px] tracking-[0.25em] text-neutral-500">
          REVIEW · 07.{String(index + 1).padStart(2, "0")}{band}
        </span>
        <span className={`font-mono-tight text-[9px] tracking-[0.25em] ${toneClasses.text}`}>OK</span>
      </div>
    </figure>
  );
});

/* ---------- SignoffBeat ---------- */
const SignoffBeat = memo(function SignoffBeat({ outroP }) {
  const hairRef = useRef(null);

  useEffect(() => {
    if (!outroP) return;
    return outroP.onChange((p) => {
      if (hairRef.current) {
        hairRef.current.style.transform = `scaleX(${interpolate(p, [0.3, 1], [0, 1])})`;
      }
    });
  }, [outroP]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
      <MonoLabel tone="coral" className="mb-6">END · MODULE 07</MonoLabel>
      <h3 className="font-display-tight italic text-4xl md:text-6xl text-white tracking-[-0.04em] leading-[1.05] max-w-3xl mb-8">
        {reviews.length} reviews logged. Feed stays open for more.
      </h3>
      <div
        ref={hairRef}
        style={{ transformOrigin: "center", transform: "scaleX(0)" }}
        className="mt-6 w-[min(640px,80vw)]"
      >
        <Hairline />
        <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          <span>07 · REVIEWS</span>
          <span>↓ 08 · CONTACT</span>
        </div>
      </div>
    </div>
  );
});

export default memo(Testimonial);
