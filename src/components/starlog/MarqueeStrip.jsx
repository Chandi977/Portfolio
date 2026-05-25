import { memo } from "react";
import { motion, useTransform } from "motion/react";

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
  const x = useTransform(
    progress,
    [0, 1],
    direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"],
  );
  const fade = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className={`absolute left-0 right-0 ${top ? "top-[18%]" : "bottom-[14%]"} overflow-hidden py-3 starlog-tape z-10`}
      style={{ opacity: fade }}
    >
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap font-mono-tight text-[11px] md:text-xs tracking-[0.18em] text-neutral-300/80"
      >
        {[...fragments, ...fragments].map((f, i) => (
          <span key={i} className="px-6 flex items-center gap-3">
            <span className="text-lavender">◇</span>
            {f}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default memo(MarqueeStrip);
