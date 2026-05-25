import { memo, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { mySocials } from "../constants";
import {
  Hairline,
  MonoLabel,
  StatusDot,
} from "../components/starlog/ds";

/* ============================================================
   END · OF · FEED
   Scroll-bound footer (~180vh). Letter-by-letter sign-off
   assembles as the user scrolls into the chapter.
   ============================================================ */

const SIGNOFF = "THANKS  FOR  TUNING  IN.";
const SUBLINE = "END · OF · FEED";

const Footer = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Atmospheric parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Hairline draws across 0.55 → 0.85
  const hairScale = useTransform(scrollYProgress, [0.55, 0.85], [0, 1], { clamp: true });

  // Footer-meta fade-in 0.78 → 1.0
  const metaOpacity = useTransform(scrollYProgress, [0.78, 1.0], [0, 1], { clamp: true });
  const socialsY = useTransform(scrollYProgress, [0.78, 1.0], [20, 0], { clamp: true });

  return (
    <footer
      ref={ref}
      className="relative"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", height: "180vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {/* Atmosphere */}
        <motion.div
          aria-hidden
          style={{
            y: bgY,
            background:
              "radial-gradient(50% 50% at 50% 60%, rgba(122,87,219,0.12) 0%, rgba(3,4,18,0) 60%), radial-gradient(35% 35% at 10% 20%, rgba(51,194,204,0.08) 0%, rgba(3,4,18,0) 60%)",
          }}
          className="absolute inset-0"
        />
        <div className="starlog-scanlines opacity-[0.04]" aria-hidden />

        {/* Reg marks */}
        <span className="reg-mark" style={{ top: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ top: 24, right: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, left: 24 }} aria-hidden />
        <span className="reg-mark" style={{ bottom: 24, right: 24 }} aria-hidden />

        {/* Top tag */}
        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex items-center gap-3 font-mono-tight text-[10px] tracking-[0.5em] text-neutral-500 z-40">
          <span className="block w-6 h-px bg-lavender/60" />
          END · OF · FEED
          <span className="block w-6 h-px bg-aqua/60" />
        </div>

        {/* Bottom progress rail */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(280px,70vw)] z-40">
          <div className="flex justify-between font-mono-tight text-[9px] tracking-[0.35em] text-neutral-500 mb-2">
            <span>00</span>
            <span>SIGN · OFF</span>
            <span>01</span>
          </div>
          <div className="h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-coral"
              style={{ width: railWidth }}
            />
          </div>
        </div>

        {/* Center stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <CallsignBadge progress={scrollYProgress} />

          <h2 className="font-display-tight italic text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.95] tracking-[-0.05em] text-white mt-10 mb-6">
            <LetterAssemble text={SIGNOFF} progress={scrollYProgress} range={[0.10, 0.55]} />
          </h2>

          <motion.div
            style={{ scaleX: hairScale, transformOrigin: "center" }}
            className="w-[min(560px,80vw)]"
          >
            <Hairline />
          </motion.div>

          <motion.p
            style={{ opacity: metaOpacity, y: socialsY }}
            className="mt-7 font-mono-tight text-[11px] tracking-[0.4em] text-neutral-400 uppercase"
          >
            {SUBLINE}
          </motion.p>

          {/* Socials grid */}
          <motion.div
            style={{ opacity: metaOpacity, y: socialsY }}
            className="mt-10 flex flex-wrap gap-2 justify-center"
          >
            {mySocials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border border-white/10 hover:border-lavender/60 hover:bg-lavender/5 px-3 py-2 transition-all"
              >
                <img
                  src={s.icon}
                  alt=""
                  className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
                <span className="font-mono-tight text-[10px] tracking-[0.25em] text-neutral-300 group-hover:text-white uppercase">
                  {s.name}
                </span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Bottom credit strip */}
        <motion.div
          style={{ opacity: metaOpacity }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 font-mono-tight text-[9px] tracking-[0.3em] text-neutral-600 uppercase text-center"
        >
          <span>© {new Date().getFullYear()} · CHARAN · 977</span>
          <span className="hidden md:inline text-neutral-700">/</span>
          <span>BUILT WITH REACT · MOTION · GSAP · LENIS · R3F</span>
        </motion.div>
      </div>
    </footer>
  );
};

/* ---------- LetterAssemble — each char fades + drops into place across a progress range ---------- */
const LetterAssemble = memo(function LetterAssemble({ text, progress, range }) {
  const chars = Array.from(text);
  const [a, b] = range;
  const total = chars.length;
  return (
    <span aria-label={text}>
      {chars.map((c, i) => (
        <LetterChar
          key={i}
          char={c}
          index={i}
          total={total}
          progress={progress}
          a={a}
          b={b}
        />
      ))}
    </span>
  );
});

const LetterChar = memo(function LetterChar({ char, index, total, progress, a, b }) {
  const span = b - a;
  const start = a + (index / total) * span * 0.7;
  const end = start + 0.04;
  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const y = useTransform(progress, [start, end], [40, 0], { clamp: true });
  const rotate = useTransform(progress, [start, end], [-8, 0], { clamp: true });
  const blur = useTransform(progress, [start, end], [6, 0], { clamp: true });
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  if (char === " ") return <span>&nbsp;</span>;
  return (
    <motion.span
      style={{ opacity, y, rotate, filter, display: "inline-block" }}
      aria-hidden
    >
      {char}
    </motion.span>
  );
});

const CallsignBadge = memo(function CallsignBadge({ progress }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm} UTC`);
    };
    fmt();
    const t = setInterval(fmt, 30000);
    return () => clearInterval(t);
  }, []);
  const opacity = useTransform(progress, [0.02, 0.18], [0, 1], { clamp: true });
  const y = useTransform(progress, [0.02, 0.18], [12, 0], { clamp: true });
  return (
    <motion.div style={{ opacity, y }} className="flex items-center gap-4">
      <span className="relative flex items-center justify-center w-7 h-7 border border-lavender/60 rotate-45">
        <span className="absolute inset-1.5 bg-lavender/80" />
      </span>
      <div className="flex flex-col items-start leading-none">
        <MonoLabel tone="lavender">CALLSIGN</MonoLabel>
        <span className="font-display-tight italic text-2xl text-white tracking-[-0.02em] mt-1">
          CHARAN · 977
        </span>
      </div>
      <span className="block w-px h-8 bg-white/15" />
      <div className="flex items-center gap-2">
        <StatusDot tone="mint" />
        <MonoLabel>SIGNED · OFF · {time}</MonoLabel>
      </div>
    </motion.div>
  );
});

export default memo(Footer);
