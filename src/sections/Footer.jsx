import { memo, useEffect, useRef, useState, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mySocials } from "../constants";
import {
  Hairline,
  MonoLabel,
  StatusDot,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   END · OF · FEED
   Scroll-bound footer (~180vh). Letter-by-letter sign-off
   assembles as the user scrolls into the chapter.
   ============================================================ */

const SIGNOFF = "THANKS  FOR  TUNING  IN.";
const SUBLINE = "END · OF · FEED";

const Footer = () => {
  const ref = useRef(null);
  const bgRef = useRef(null);
  const railRef = useRef(null);
  const hairRef = useRef(null);
  const metaRef = useRef(null);
  const socialsRef = useRef(null);
  const creditRef = useRef(null);
  const badgeRef = useRef(null);
  const letterRefs = useRef([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = letterRefs.current;
    const total = chars.filter(Boolean).length;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom bottom",
      scrub: 0,
      onUpdate: (self) => {
        const p = self.progress;

        // Atmosphere parallax
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${interpolate(p, [0, 1], [8, -8])}%)`;
        }

        // Progress rail
        if (railRef.current) railRef.current.style.width = `${p * 100}%`;

        // Hairline 0.55→0.85
        if (hairRef.current) {
          hairRef.current.style.transform = `scaleX(${interpolate(p, [0.55, 0.85], [0, 1])})`;
        }

        // Meta/socials/credit 0.78→1.0
        const metaOp = interpolate(p, [0.78, 1.0], [0, 1]);
        const sY = interpolate(p, [0.78, 1.0], [20, 0]);
        if (metaRef.current) {
          metaRef.current.style.opacity = metaOp;
          metaRef.current.style.transform = `translateY(${sY}px)`;
        }
        if (socialsRef.current) {
          socialsRef.current.style.opacity = metaOp;
          socialsRef.current.style.transform = `translateY(${sY}px)`;
        }
        if (creditRef.current) creditRef.current.style.opacity = metaOp;

        // Badge 0.02→0.18
        if (badgeRef.current) {
          badgeRef.current.style.opacity = interpolate(p, [0.02, 0.18], [0, 1]);
          badgeRef.current.style.transform = `translateY(${interpolate(p, [0.02, 0.18], [12, 0])}px)`;
        }

        // Letter assembly 0.10→0.55
        const rangeSpan = 0.45;
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          if (!c) continue;
          const start = 0.10 + (i / total) * rangeSpan * 0.7;
          const end = start + 0.04;
          c.style.opacity = interpolate(p, [start, end], [0, 1]);
          c.style.transform = `translateY(${interpolate(p, [start, end], [40, 0])}px) rotate(${interpolate(p, [start, end], [-8, 0])}deg)`;
          c.style.filter = `blur(${interpolate(p, [start, end], [6, 0])}px)`;
        }
      },
    });

    return () => st.kill();
  }, []);

  const chars = Array.from(SIGNOFF);

  return (
    <footer
      ref={ref}
      className="relative"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", height: "180vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-primary">
        {/* Atmosphere */}
        <div
          ref={bgRef}
          aria-hidden
          style={{
            background:
              "radial-gradient(50% 50% at 50% 60%, rgba(122,87,219,0.12) 0%, rgba(3,4,18,0) 60%), radial-gradient(35% 35% at 10% 20%, rgba(51,194,204,0.08) 0%, rgba(3,4,18,0) 60%)",
            willChange: "transform",
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
            <div
              ref={railRef}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-coral"
              style={{ width: "0%" }}
            />
          </div>
        </div>

        {/* Center stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <CallsignBadge ref={badgeRef} />

          <h2 className="font-display-tight italic text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.95] tracking-[-0.05em] text-white mt-10 mb-6">
            <span aria-label={SIGNOFF}>
              {chars.map((c, i) =>
                c === " " ? (
                  <span key={i}>&nbsp;</span>
                ) : (
                  <span
                    key={i}
                    ref={(el) => (letterRefs.current[i] = el)}
                    style={{ display: "inline-block", opacity: 0, willChange: "transform, opacity, filter" }}
                    aria-hidden
                  >
                    {c}
                  </span>
                )
              )}
            </span>
          </h2>

          <div
            ref={hairRef}
            style={{ transformOrigin: "center", transform: "scaleX(0)" }}
            className="w-[min(560px,80vw)]"
          >
            <Hairline />
          </div>

          <p
            ref={metaRef}
            style={{ opacity: 0 }}
            className="mt-7 font-mono-tight text-[11px] tracking-[0.4em] text-neutral-400 uppercase"
          >
            {SUBLINE}
          </p>

          {/* Socials grid */}
          <div
            ref={socialsRef}
            style={{ opacity: 0 }}
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
          </div>
        </div>

        {/* Bottom credit strip */}
        <div
          ref={creditRef}
          style={{ opacity: 0 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 font-mono-tight text-[9px] tracking-[0.3em] text-neutral-600 uppercase text-center"
        >
          <span>© {new Date().getFullYear()} · CHARAN · 977</span>
          <span className="hidden md:inline text-neutral-700">/</span>
          <span>BUILT WITH REACT · GSAP · R3F · LENIS</span>
        </div>
      </div>
    </footer>
  );
};

/* ---------- CallsignBadge ---------- */
const CallsignBadge = memo(
  forwardRef(function CallsignBadge(_props, ref) {
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

    return (
      <div ref={ref} style={{ opacity: 0, willChange: "transform, opacity" }} className="flex items-center gap-4">
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
      </div>
    );
  })
);

export default memo(Footer);
