import { memo, useRef, useEffect, useState } from "react";
import { interpolate } from "../../hooks/useGSAPBeat";

const stats = [
  { label: "GITHUB CONTRIBUTIONS / 2026", from: 0, to: 382, suffix: "" },
  { label: "SYSTEMS SHIPPED", from: 0, to: 17, suffix: "" },
  { label: "P99 LATENCY", from: 240, to: 38, suffix: "ms" },
  { label: "UPTIME", from: 91, to: 99, suffix: ".94%" },
];

const logLines = [
  "→ git push origin main",
  "✓ redis.flashkv  ::  ttl=30s hit_ratio=0.94",
  "✓ deploy.lambda  ::  cold_start=412ms",
  "△ throttle.gateway  ::  429 burst absorbed",
  "✓ docker compose up -d ::  4 services ok",
  "→ websocket.peer  ::  rooms=128 latency<40ms",
  "✓ ec2 autoscale  ::  +2 instances",
  "→ mongo.index  ::  built compound(idx,ts)",
];

const RollingNumber = memo(function RollingNumber({ progress, from, to, suffix, format = (n) => n.toLocaleString() }) {
  const [display, setDisplay] = useState(format(from));

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const val = Math.round(from + p * (to - from));
      setDisplay(format(val));
    });
  }, [progress, from, to, format]);

  return (
    <span className="font-mono-tight tabular-nums">
      {display}
      {suffix}
    </span>
  );
});

const Telemetry = ({ progress }) => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const tapeRef = useRef(null);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const left = leftRef.current;
      const right = rightRef.current;
      const tape = tapeRef.current;

      const fade = interpolate(p, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

      if (left) {
        left.style.opacity = fade;
        left.style.transform = `translateY(-50%) translateX(${interpolate(p, [0, 0.2], [-30, 0])}px)`;
      }
      if (right) {
        right.style.opacity = fade;
        right.style.transform = `translateY(-50%) translateX(${interpolate(p, [0, 0.2], [30, 0])}px)`;
      }
      if (tape) {
        tape.style.transform = `translateY(${interpolate(p, [0, 1], [0, -100 * (logLines.length - 1)])}px)`;
      }
    });
  }, [progress]);

  return (
    <>
      {/* LEFT — telemetry stack */}
      <aside
        ref={leftRef}
        className="absolute left-6 md:left-10 top-1/2 z-20 max-w-[260px] hidden md:block"
        style={{ opacity: 0, transform: "translateY(-50%)", willChange: "transform, opacity" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="block w-2 h-2 rounded-full bg-coral shadow-[0_0_10px_#ea4884] animate-pulse" />
          <span className="font-mono-tight text-[10px] tracking-[0.32em] text-neutral-400">
            // TELEMETRY · LIVE
          </span>
        </div>
        <ul className="space-y-4">
          {stats.map((s) => (
            <li key={s.label} className="border-l border-lavender/30 pl-3">
              <div className="font-mono-tight text-[10px] tracking-[0.28em] text-neutral-500">
                {s.label}
              </div>
              <div className="font-display-tight text-3xl text-white leading-none mt-1">
                <RollingNumber progress={progress} {...s} />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* RIGHT — log tape */}
      <aside
        ref={rightRef}
        className="absolute right-6 md:right-10 top-1/2 z-20 w-[260px] hidden md:block"
        style={{ opacity: 0, transform: "translateY(-50%)", willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono-tight text-[10px] tracking-[0.32em] text-neutral-400">
            ::LOG / 03h41m
          </span>
          <span className="block w-2 h-2 rounded-full bg-aqua shadow-[0_0_10px_#33c2cc]" />
        </div>
        <div className="relative h-44 overflow-hidden border-y border-aqua/15">
          <ul
            ref={tapeRef}
            className="font-mono-tight text-[11px] text-neutral-300/90"
            style={{ willChange: "transform" }}
          >
            {logLines.map((l) => (
              <li
                key={l}
                className="whitespace-nowrap overflow-hidden text-ellipsis border-b border-white/5 pl-3 flex items-center"
                style={{ height: 100 }}
              >
                {l}
              </li>
            ))}
          </ul>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/90 via-transparent to-primary/90" />
        </div>
      </aside>
    </>
  );
};

export default memo(Telemetry);
