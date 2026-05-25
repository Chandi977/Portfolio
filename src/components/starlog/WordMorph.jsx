import { memo, useRef, useEffect } from "react";
import { interpolate } from "../../hooks/useGSAPBeat";

const words = [
  { word: "ENGINEER", sub: "// scalable backends · MERN · system design" },
  { word: "ARCHITECT", sub: "// caches, queues, sockets, contracts" },
  { word: "SHIP", sub: "// 03:00 deploys · zero-downtime · receipts" },
];

const ranges = [
  [0.00, 0.18, 0.32, 0.40],
  [0.36, 0.50, 0.64, 0.72],
  [0.68, 0.82, 0.92, 1.00],
];

const WordRow = memo(function WordRow({ word, sub, progress, range }) {
  const wordRef = useRef(null);
  const subRef = useRef(null);
  const [a, b, c, d] = range;

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const wordEl = wordRef.current;
      const subEl = subRef.current;
      if (!wordEl) return;

      const opacity = interpolate(p, [a, b, c, d], [0, 1, 1, 0]);
      const y = interpolate(p, [a, b, c, d], [80, 0, 0, -80]);
      const blur = interpolate(p, [a, b, c, d], [10, 0, 0, 10]);

      wordEl.style.opacity = opacity;
      wordEl.style.transform = `translateY(${y}px)`;
      wordEl.style.filter = `blur(${blur}px)`;

      if (subEl) {
        subEl.style.opacity = interpolate(p, [a, b, c, d], [0, 0.7, 0.7, 0]);
      }
    });
  }, [progress, a, b, c, d]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="word-mask overflow-hidden">
        <h2
          ref={wordRef}
          style={{ opacity: 0, willChange: "transform, opacity, filter" }}
          className="font-display-tight italic text-white text-[18vw] md:text-[14vw] leading-[0.9] tracking-[-0.05em] text-center"
        >
          {word}
        </h2>
      </div>
      <p
        ref={subRef}
        style={{ opacity: 0 }}
        className="mt-6 font-mono-tight text-[11px] md:text-xs tracking-[0.34em] text-aqua/80 uppercase"
      >
        {sub}
      </p>
    </div>
  );
});

const WordMorph = ({ progress }) => {
  const containerRef = useRef(null);
  const orbit1Ref = useRef(null);
  const orbit2Ref = useRef(null);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const container = containerRef.current;
      const orbit1 = orbit1Ref.current;
      const orbit2 = orbit2Ref.current;
      if (!container) return;

      container.style.opacity = interpolate(p, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

      if (orbit1) orbit1.style.transform = `translate(-50%, -50%) translateX(${interpolate(p, [0, 1], [-60, 60])}px)`;
      if (orbit2) orbit2.style.transform = `translate(-50%, -50%) translateX(${interpolate(p, [0, 1], [40, -40])}px)`;
    });
  }, [progress]);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ opacity: 0 }}>
      {/* Decorative thin orbit behind the words */}
      <div
        ref={orbit1Ref}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmin] h-[120vmin] rounded-full border border-lavender/15"
        style={{ willChange: "transform" }}
      />
      <div
        ref={orbit2Ref}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-aqua/15"
        style={{ willChange: "transform" }}
      />

      {words.map((w, i) => (
        <WordRow key={w.word} {...w} progress={progress} range={ranges[i]} />
      ))}

      {/* Index badge */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          BEAT
        </span>
        <span className="font-mono-tight text-[10px] tracking-[0.4em] text-lavender">
          003 — MORPH
        </span>
      </div>
    </div>
  );
};

export default memo(WordMorph);
