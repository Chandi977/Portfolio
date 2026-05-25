import { memo, useRef, useEffect } from "react";
import { interpolate } from "../../hooks/useGSAPBeat";

const fragments = [
  "src/server/gateway.ts",
  "kv: flashkv.lru(5_000)",
  "ws://room/:id",
  "POST /v1/auth/session",
  "mongo.compoundIndex(idx,ts)",
  "ec2 t3.small × 4",
  "redis.evict(allkeys-lru)",
  "aws.s3.signed(3600)",
  "react.suspense.lazy()",
  "docker compose up -d",
  "p99 ≤ 38ms",
  "queue.batch(64)",
];

const MarqueeStrip = ({ progress, direction = 1, top = false }) => {
  const containerRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    if (!progress) return;
    return progress.onChange((p) => {
      const container = containerRef.current;
      const strip = stripRef.current;
      if (!container || !strip) return;

      container.style.opacity = interpolate(p, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

      const xPercent = direction > 0
        ? interpolate(p, [0, 1], [0, -50])
        : interpolate(p, [0, 1], [-50, 0]);
      strip.style.transform = `translateX(${xPercent}%)`;
    });
  }, [progress, direction]);

  return (
    <div
      ref={containerRef}
      className={`absolute left-0 right-0 ${top ? "top-[18%]" : "bottom-[14%]"} overflow-hidden py-3 starlog-tape z-10`}
      style={{ opacity: 0 }}
    >
      <div
        ref={stripRef}
        className="flex whitespace-nowrap font-mono-tight text-[11px] md:text-xs tracking-[0.18em] text-neutral-300/80"
        style={{ willChange: "transform" }}
      >
        {[...fragments, ...fragments].map((f, i) => (
          <span key={i} className="px-6 flex items-center gap-3">
            <span className="text-lavender">◇</span>
            {f}
          </span>
        ))}
      </div>
    </div>
  );
};

export default memo(MarqueeStrip);
