import { memo } from "react";
import { motion, useTransform } from "motion/react";
import { reviews } from "../constants";
import {
  PinnedStage,
  Beat,
  WordReveal,
  MonoLabel,
  StatusDot,
  Hairline,
} from "../components/starlog/ds";

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
    callsign="INTERCEPTS"
    tone="coral"
    height={320}
    beatLabels={["INCOMING", "FEED", "SIGNOFF"]}
  >
    {(p) => <TestimonialBeats p={p} />}
  </PinnedStage>
);

const TestimonialBeats = ({ p }) => {
  const intro = useTransform(p, [0, 0.15], [0, 1], { clamp: true });
  const feed = useTransform(p, [0.15, 0.85], [0, 1], { clamp: true });
  const outro = useTransform(p, [0.85, 1.0], [0, 1], { clamp: true });

  // Two band x-translations bound to scroll
  const bandAX = useTransform(feed, [0, 1], ["10%", "-110%"]);
  const bandBX = useTransform(feed, [0, 1], ["-110%", "10%"]);

  const firstHalf = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondHalf = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <>
      {/* ════ BEAT 1 — INCOMING ════ */}
      <Beat progress={p} range={[0, 0, 0.13, 0.17]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="coral" />
            <MonoLabel tone="coral">::INCOMING · {reviews.length} CAPTURED</MonoLabel>
            <span className="block w-6 h-px bg-white/20" />
            <MonoLabel tone="aqua">BAND-S · 2.4GHz</MonoLabel>
          </div>
          <h2 className="font-display-tight italic text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={intro}
              text="Signals from people I've shipped with."
              revealWindow={0.85}
            />
          </h2>
          <motion.p
            style={{ opacity: useTransform(intro, [0.7, 1], [0, 1]) }}
            className="mt-10 font-mono-tight text-xs tracking-[0.4em] text-coral/80 uppercase"
          >
            ↓ SCROLL TO RECEIVE FEED
          </motion.p>
        </div>
      </Beat>

      {/* ════ BEAT 2 — FEED (scroll-driven) ════ */}
      <Beat progress={p} range={[0.13, 0.18, 0.82, 0.88]}>
        <div className="absolute inset-0 flex flex-col justify-center">
          {/* Header tag */}
          <motion.div
            style={{ opacity: useTransform(feed, [0, 0.1], [0, 1]) }}
            className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30"
          >
            <StatusDot tone="aqua" />
            <MonoLabel tone="aqua">::FEED · LIVE</MonoLabel>
          </motion.div>

          {/* Band A */}
          <div className="relative mb-6 md:mb-10">
            <div className="flex items-center gap-4 mb-3 px-6">
              <MonoLabel tone="coral">▼ BAND · A · 47.32MHz</MonoLabel>
              <span className="flex-1 h-px bg-coral/20" />
              <MonoLabel>{firstHalf.length} INTERCEPTS</MonoLabel>
            </div>
            <div className="relative overflow-hidden">
              <motion.div
                style={{ x: bandAX }}
                className="flex gap-5 will-change-transform"
              >
                {firstHalf.map((r, i) => (
                  <InterceptCard key={r.username} review={r} index={i} feed={feed} band="A" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Band B (counter-direction) */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-3 px-6">
              <MonoLabel tone="aqua">▲ BAND · B · 51.04MHz</MonoLabel>
              <span className="flex-1 h-px bg-aqua/20" />
              <MonoLabel>{secondHalf.length} INTERCEPTS</MonoLabel>
            </div>
            <div className="relative overflow-hidden">
              <motion.div
                style={{ x: bandBX }}
                className="flex gap-5 will-change-transform"
              >
                {secondHalf.map((r, i) => (
                  <InterceptCard key={r.username} review={r} index={i} feed={feed} band="B" />
                ))}
              </motion.div>
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
      <Beat progress={p} range={[0.85, 0.90, 1.0, 1.0]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <MonoLabel tone="coral" className="mb-6">END · TRANSMISSION 07</MonoLabel>
          <h3 className="font-display-tight italic text-4xl md:text-6xl text-white tracking-[-0.04em] leading-[1.05] max-w-3xl mb-8">
            {reviews.length} signals captured. Feed remains open.
          </h3>
          <motion.div
            style={{ scaleX: useTransform(outro, [0.3, 1], [0, 1]), transformOrigin: "center" }}
            className="mt-6 w-[min(640px,80vw)]"
          >
            <Hairline />
            <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
              <span>07 · INTERCEPTS</span>
              <span>↓ 08 · UPLINK</span>
            </div>
          </motion.div>
        </div>
      </Beat>
    </>
  );
};

/* ---------- InterceptCard with scanline capture animation ---------- */
const InterceptCard = memo(function InterceptCard({ review, index, feed, band }) {
  // Determine when this card crosses the center scanline.
  // For band A, x goes from 10% to -110% (total -120% travel). Each card travels through center
  // at some fraction of feed progress depending on its index and the strip's width per card.
  // We use a generic capture window centered around when this card is near the middle.
  // Since the strip translates monotonically, we can approximate by mapping index → progress slot.
  // Per-card window is roughly: 0.05 wide, centered at fraction of strip travel.
  // We don't know exact widths; we use a simple sequential schedule and let the animation feel right.
  const cardWidth = 0.06; // window width in feed-progress
  const baseShift = band === "A" ? 0.12 : 0.06; // band B leads slightly
  const slot = baseShift + index * cardWidth;

  // Scanline opacity peaks at the slot center
  const captureGlow = useTransform(
    feed,
    [slot - cardWidth / 2, slot, slot + cardWidth / 2],
    [0, 1, 0],
    { clamp: true },
  );

  const tone = ["lavender", "aqua", "coral", "mint"][index % 4];
  const toneClasses = {
    lavender: { border: "border-lavender/30", text: "text-lavender", glow: "shadow-[0_0_30px_-10px_rgba(122,87,219,0.7)]" },
    aqua: { border: "border-aqua/30", text: "text-aqua", glow: "shadow-[0_0_30px_-10px_rgba(51,194,204,0.7)]" },
    coral: { border: "border-coral/30", text: "text-coral", glow: "shadow-[0_0_30px_-10px_rgba(234,72,132,0.7)]" },
    mint: { border: "border-mint/30", text: "text-mint", glow: "shadow-[0_0_30px_-10px_rgba(87,219,150,0.7)]" },
  }[tone];

  const freq = (47 + index * 3.7).toFixed(2);

  return (
    <motion.figure
      className={`relative shrink-0 w-72 h-auto starlog-clip border ${toneClasses.border} bg-gradient-to-b from-midnight/85 to-primary/85 px-4 py-4 ${toneClasses.glow}`}
    >
      {/* Capture scanline overlay */}
      <motion.div
        aria-hidden
        style={{ opacity: captureGlow }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/80" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-white/[0.08]" />
      </motion.div>

      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <span className={`font-mono-tight text-[10px] tracking-[0.22em] ${toneClasses.text}`}>
            {freq}MHz
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
          INTERCEPT · 07.{String(index + 1).padStart(2, "0")}{band}
        </span>
        <span className={`font-mono-tight text-[9px] tracking-[0.25em] ${toneClasses.text}`}>OK</span>
      </div>
    </motion.figure>
  );
});

export default memo(Testimonial);
