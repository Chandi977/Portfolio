import { memo } from "react";
import { motion, useTransform } from "motion/react";

const words = [
  { word: "ENGINEER", sub: "// scalable backends · MERN · system design" },
  { word: "ARCHITECT", sub: "// caches, queues, sockets, contracts" },
  { word: "SHIP", sub: "// 03:00 deploys · zero-downtime · receipts" },
];

const WordRow = ({ word, sub, progress, range }) => {
  // Each row owns a [start, peak1, peak2, end] window.
  const [a, b, c, d] = range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [80, 0, 0, -80]);
  const subOpacity = useTransform(progress, [a, b, c, d], [0, 0.7, 0.7, 0]);
  const blur = useTransform(progress, [a, b, c, d], [10, 0, 0, 10]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <div className="word-mask overflow-hidden">
        <motion.h2
          style={{ opacity, y, filter }}
          className="font-display-tight italic text-white text-[18vw] md:text-[14vw] leading-[0.9] tracking-[-0.05em] text-center"
        >
          {word}
        </motion.h2>
      </div>
      <motion.p
        style={{ opacity: subOpacity }}
        className="mt-6 font-mono-tight text-[11px] md:text-xs tracking-[0.34em] text-aqua/80 uppercase"
      >
        {sub}
      </motion.p>
    </div>
  );
};

const WordMorph = ({ progress }) => {
  // progress is the local beat MotionValue (0 → 1)
  // Slice that into three overlapping windows for the three words.
  const ranges = [
    [0.00, 0.18, 0.32, 0.40],
    [0.36, 0.50, 0.64, 0.72],
    [0.68, 0.82, 0.92, 1.00],
  ];

  // A small accent ring that drifts behind the words
  const drift = useTransform(progress, [0, 1], [-60, 60]);
  const drift2 = useTransform(progress, [0, 1], [40, -40]);
  const fade = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity: fade }}>
      {/* Decorative thin orbit behind the words */}
      <motion.div
        style={{ x: drift }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmin] h-[120vmin] rounded-full border border-lavender/15"
      />
      <motion.div
        style={{ x: drift2 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full border border-aqua/15"
      />

      {words.map((w, i) => (
        <WordRow key={w.word} {...w} progress={progress} range={ranges[i]} />
      ))}

      {/* Index badge top-left of the beat */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
          BEAT
        </span>
        <span className="font-mono-tight text-[10px] tracking-[0.4em] text-lavender">
          003 — MORPH
        </span>
      </div>
    </motion.div>
  );
};

export default memo(WordMorph);
