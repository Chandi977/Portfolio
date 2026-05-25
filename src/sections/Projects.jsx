import { memo, useState, useEffect, useRef } from "react";
import { myProjects } from "../constants";
import {
  PinnedStage,
  Beat,
  WordReveal,
  MonoLabel,
  MonoPill,
  StatusDot,
  Hairline,
  useSubProgress,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

/* ============================================================
   TRANSMISSION 05 // DEPLOYMENTS
   Tall pinned chapter. Intro beat + one beat per project.
   With N=7 projects: 100vh intro + 100vh per project = 800vh.
     - INTRO    0.00 → 0.125
     - DEPLOY i 0.125 + i/N * 0.875 → 0.125 + (i+1)/N * 0.875
   ============================================================ */

const N = myProjects.length;
const INTRO_END = 0.125;
const DEPLOY_RANGE = 1 - INTRO_END;
const PER_PROJECT = DEPLOY_RANGE / N;

const Projects = () => (
  <PinnedStage
    id="work"
    index="05"
    callsign="DEPLOYMENTS"
    tone="coral"
    height={100 + N * 100}
    beatLabels={["INTRO", `${N} CASES`]}
  >
    {(p) => <ProjectsBeats p={p} />}
  </PinnedStage>
);

const ProjectsBeats = ({ p }) => {
  const introP = useSubProgress(p, 0, INTRO_END);

  return (
    <>
      {/* ════════ INTRO BEAT ════════ */}
      <Beat progress={p} range={[0, 0, INTRO_END - 0.02, INTRO_END + 0.02]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div className="flex items-center gap-3 mb-8">
            <StatusDot tone="coral" />
            <MonoLabel tone="coral">::ARCHIVE · 05.00 · {N} FILES</MonoLabel>
          </div>
          <h2 className="font-display-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.04em] text-white max-w-5xl">
            <WordReveal
              progress={introP}
              text="Case files from the workshop. What I built, what shipped, what broke."
              revealWindow={0.85}
            />
          </h2>
          <FadeIn progress={introP} start={0.7} end={1}>
            <p className="mt-10 font-mono-tight text-xs tracking-[0.4em] text-aqua/80 uppercase">
              ↓ KEEP SCROLLING TO ADVANCE THE FEED
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* Persistent case-index ticker (visible during deploys) */}
      <CaseTicker p={p} />

      {/* ════════ ONE BEAT PER PROJECT ════════ */}
      {myProjects.map((project, i) => {
        const start = INTRO_END + i * PER_PROJECT;
        const end = start + PER_PROJECT;
        return (
          <ProjectBeat
            key={project.id}
            project={project}
            index={i}
            p={p}
            start={start}
            end={end}
          />
        );
      })}

      {/* Outro hairline (shows during last project) */}
      <Beat progress={p} range={[0.94, 0.97, 1.0, 1.0]}>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[min(640px,80vw)] z-30">
          <Hairline />
          <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
            <span>END · TRANSMISSION 05</span>
            <span>↓ 06 · ARCHIVE</span>
          </div>
        </div>
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

/* ---------- CaseTicker ---------- */
const CaseTicker = memo(function CaseTicker({ p }) {
  const ref = useRef(null);
  const [v, setV] = useState(1);

  useEffect(() => {
    if (!p) return;
    return p.onChange((progress) => {
      // Opacity
      if (ref.current) {
        ref.current.style.opacity = interpolate(
          progress,
          [INTRO_END, INTRO_END + 0.03, 0.94, 0.98],
          [0, 1, 1, 0]
        );
      }
      // Case number
      const caseIdx = interpolate(progress, [INTRO_END, 1], [0, N]);
      setV(Math.min(N, Math.floor(caseIdx) + 1));
    });
  }, [p]);

  return (
    <div
      ref={ref}
      style={{ opacity: 0 }}
      className="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4"
    >
      <MonoLabel tone="coral">CASE · FILE</MonoLabel>
      <span className="block w-px h-4 bg-white/20" />
      <span className="font-display-tight text-2xl text-white tabular-nums tracking-[-0.02em]">
        {String(v).padStart(2, "0")}
      </span>
      <span className="font-mono-tight text-sm text-neutral-500">/ {String(N).padStart(2, "0")}</span>
    </div>
  );
});

/* ---------- ProjectBeat ---------- */
const ProjectBeat = memo(function ProjectBeat({ project, index, p, start, end }) {
  const localP = useSubProgress(p, start, end);

  const outerRef = useRef(null);
  const indexRef = useRef(null);
  const imgRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    if (!localP) return;
    return localP.onChange((lp) => {
      // Outer beat opacity + drift
      if (outerRef.current) {
        const opacity = interpolate(lp, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
        const bgX = interpolate(lp, [0, 1], [-3, 3]);
        outerRef.current.style.opacity = opacity;
        outerRef.current.style.transform = `translateX(${bgX}%)`;
      }

      // Giant index
      if (indexRef.current) {
        indexRef.current.style.opacity = interpolate(lp, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
        indexRef.current.style.transform = `translateY(${interpolate(lp, [0, 1], [-10, 10])}%)`;
      }

      // Image parallax
      if (imgRef.current) {
        const imgX = interpolate(lp, [0, 0.5, 1], [30, 0, -15]);
        const imgScale = interpolate(lp, [0, 0.5, 1], [1.15, 1.0, 0.95]);
        const imgOp = interpolate(lp, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
        imgRef.current.style.transform = `translateX(${imgX}%) scale(${imgScale})`;
        imgRef.current.style.opacity = imgOp;
      }

      // Info rise
      if (infoRef.current) {
        infoRef.current.style.transform = `translateY(${interpolate(lp, [0.05, 0.35], [40, 0])}%)`;
        infoRef.current.style.opacity = interpolate(lp, [0, 0.20, 0.82, 1], [0, 1, 1, 0]);
      }
    });
  }, [localP]);

  return (
    <div
      ref={outerRef}
      style={{ opacity: 0, willChange: "transform, opacity" }}
      className="absolute inset-0 flex items-center"
    >
      {/* GIANT INDEX */}
      <div
        ref={indexRef}
        aria-hidden
        style={{ opacity: 0, willChange: "transform" }}
        className="absolute left-[-8vw] top-1/2 -translate-y-1/2 font-display-tight tracking-[-0.07em] text-white/[0.04] select-none pointer-events-none"
      >
        <span className="text-[44vh] leading-none italic">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 px-6 lg:px-16 py-24">
        {/* IMAGE */}
        <div
          ref={imgRef}
          style={{ opacity: 0, willChange: "transform, opacity" }}
          className="lg:col-span-7 lg:order-2 relative starlog-clip border border-lavender/30 bg-primary overflow-hidden h-[280px] md:h-[400px] lg:h-[500px]"
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 starlog-scanlines opacity-[0.08]" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <MonoLabel tone="lavender">LIVE · PREVIEW</MonoLabel>
            <span className="block w-2 h-2 rounded-full bg-coral animate-pulse" />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
            <MonoLabel>{project.category || "WEB"}</MonoLabel>
            <MonoLabel tone="aqua">{project.stats?.year || "—"}</MonoLabel>
          </div>
        </div>

        {/* INFO */}
        <div
          ref={infoRef}
          style={{ opacity: 0, willChange: "transform, opacity" }}
          className="lg:col-span-5 lg:order-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="font-display-tight text-5xl text-coral tracking-[-0.04em]">
              {String(index + 1).padStart(2, "0")}
              <span className="text-white/40">.</span>
            </span>
            <div className="flex flex-col">
              <MonoLabel tone="coral">CASE · 05.{String(index + 1).padStart(2, "0")}</MonoLabel>
              <MonoLabel>{project.stats?.role || "DEV"}</MonoLabel>
            </div>
          </div>

          <h3 className="font-display-tight text-2xl md:text-4xl lg:text-5xl text-white tracking-[-0.035em] leading-[1.05] mb-5">
            {project.title}
          </h3>

          <p className="text-sm md:text-base text-neutral-300 leading-relaxed mb-6 line-clamp-4">
            {project.description}
          </p>

          {project.technologies && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.technologies.slice(0, 6).map((t) => (
                <MonoPill key={t} tone="neutral">{t}</MonoPill>
              ))}
              {project.technologies.length > 6 && (
                <MonoPill tone="lavender">+{project.technologies.length - 6}</MonoPill>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-lavender/40 hover:border-lavender hover:bg-lavender/5 px-4 py-2 font-mono-tight text-[11px] tracking-[0.25em] text-white uppercase transition-all"
              >
                VIEW · LIVE <span className="text-lavender">↗</span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-white/15 hover:border-white/40 px-4 py-2 font-mono-tight text-[11px] tracking-[0.25em] text-white uppercase transition-all"
              >
                SOURCE · GIT <span className="text-neutral-400">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default memo(Projects);
