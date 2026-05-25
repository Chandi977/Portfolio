/* eslint-disable react/prop-types */
import { memo, useMemo } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";

const labels = [
  { text: "REACT · 19", angle: 0,   tone: "#9b80f5" },
  { text: "NODE · JS",  angle: 60,  tone: "#33c2cc" },
  { text: "MONGO · DB", angle: 120, tone: "#57db96" },
  { text: "REDIS · KV", angle: 180, tone: "#ea4884" },
  { text: "AWS · EC2",  angle: 240, tone: "#33c2cc" },
  { text: "WS · RT",    angle: 300, tone: "#9b80f5" },
];

const RADIUS = 230;
const SCAN_RADIUS = 177;
const SCAN_ANGLE = 52;
const SCAN_DURATION = 4.2;
const SCAN_RADIANS = (SCAN_ANGLE * Math.PI) / 180;
const SCAN_TRAIL_X = Number((-SCAN_RADIUS * Math.sin(SCAN_RADIANS)).toFixed(2));
const SCAN_TRAIL_Y = Number((-SCAN_RADIUS * Math.cos(SCAN_RADIANS)).toFixed(2));
const SCAN_PATH = `M 0 0 L ${SCAN_TRAIL_X} ${SCAN_TRAIL_Y} A ${SCAN_RADIUS} ${SCAN_RADIUS} 0 0 1 0 -${SCAN_RADIUS} Z`;
const RADAR_RINGS = [
  { radius: 44, range: "045" },
  { radius: 88, range: "090" },
  { radius: 132, range: "135" },
  { radius: SCAN_RADIUS, range: "180" },
];
const RADAR_TARGETS = [
  { id: "TGT-01", bearing: 40, x: 78, y: -93, labelX: 90, labelY: -105, tone: "#57db96", lock: true },
  { id: "TGT-02", bearing: 298, x: -106, y: -57, labelX: -98, labelY: -69, tone: "#33c2cc" },
  { id: "TGT-03", bearing: 123, x: 103, y: 66, labelX: 95, labelY: 85, tone: "#ea4884" },
];

const Ticks = memo(function Ticks({ radius, count, color, length = 8 }) {
  const ticks = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * 360;
        const isMajor = i % (count / 12) === 0;
        return (
          <line
            key={i}
            x1="0"
            y1={-radius}
            x2="0"
            y2={-radius + (isMajor ? length * 1.7 : length)}
            stroke={color}
            strokeWidth={isMajor ? 1.2 : 0.6}
            transform={`rotate(${a})`}
            opacity={isMajor ? 1 : 0.3}
          />
        );
      }),
    [radius, count, color, length],
  );
  return <g>{ticks}</g>;
});

const RadarGrid = memo(function RadarGrid() {
  return (
    <g aria-hidden>
      <circle r={SCAN_RADIUS} fill="rgba(6,9,31,0.32)" stroke="rgba(51,194,204,0.18)" />
      {RADAR_RINGS.map(({ radius, range }) => (
        <g key={radius}>
          <circle
            r={radius}
            fill="none"
            stroke={radius === SCAN_RADIUS ? "rgba(51,194,204,0.28)" : "rgba(51,194,204,0.13)"}
            strokeWidth={radius === SCAN_RADIUS ? 1 : 0.75}
            strokeDasharray={radius === SCAN_RADIUS ? "2 6" : undefined}
          />
          <text
            x="5"
            y={-radius + 11}
            fontSize="6.5"
            letterSpacing="1.3"
            fill="rgba(51,194,204,0.45)"
            fontFamily="Space Mono, monospace"
          >
            {range}
          </text>
        </g>
      ))}
      {[0, 45, 90, 135].map((angle) => (
        <line
          key={angle}
          x1={-SCAN_RADIUS}
          y1="0"
          x2={SCAN_RADIUS}
          y2="0"
          transform={`rotate(${angle})`}
          stroke="rgba(51,194,204,0.10)"
          strokeDasharray="2 5"
        />
      ))}
      <line x1={-SCAN_RADIUS} y1="0" x2={SCAN_RADIUS} y2="0" stroke="rgba(155,128,245,0.21)" />
      <line x1="0" y1={-SCAN_RADIUS} x2="0" y2={SCAN_RADIUS} stroke="rgba(155,128,245,0.21)" />
      <text x="0" y={-SCAN_RADIUS - 8} textAnchor="middle" fontSize="7" letterSpacing="2" fill="rgba(51,194,204,0.7)" fontFamily="Space Mono, monospace">
        N / 000
      </text>
      <text x={SCAN_RADIUS + 8} y="2.5" fontSize="7" letterSpacing="2" fill="rgba(51,194,204,0.6)" fontFamily="Space Mono, monospace">
        E
      </text>
      <text x="0" y={SCAN_RADIUS + 13} textAnchor="middle" fontSize="7" letterSpacing="2" fill="rgba(51,194,204,0.6)" fontFamily="Space Mono, monospace">
        S / 180
      </text>
      <text x={-SCAN_RADIUS - 8} y="2.5" textAnchor="end" fontSize="7" letterSpacing="2" fill="rgba(51,194,204,0.6)" fontFamily="Space Mono, monospace">
        W
      </text>
    </g>
  );
});

const RadarTarget = memo(function RadarTarget({ id, bearing, x, y, labelX, labelY, tone, lock = false, reduceMotion }) {
  const contactPhase = bearing / 360;
  const contactTimes = [0, Math.max(0, contactPhase - 0.025), contactPhase, Math.min(1, contactPhase + 0.05), 1];
  const contactTransition = reduceMotion
    ? { duration: 0 }
    : { duration: SCAN_DURATION, times: contactTimes, repeat: Infinity, ease: "linear" };

  return (
    <g data-testid={`radar-target-${id}`} data-bearing={bearing}>
      <line x1={x} y1={y} x2={labelX} y2={labelY + 3} stroke={tone} strokeOpacity="0.42" strokeWidth="0.75" strokeDasharray="2 2" />
      {lock ? (
        <>
          <motion.circle
            cx={x}
            cy={y}
            r="12"
            fill="none"
            stroke={tone}
            strokeWidth="0.8"
            animate={reduceMotion ? { opacity: 0.75, scale: 1 } : { opacity: [0.08, 0.08, 0.95, 0.08, 0.08], scale: [0.9, 0.9, 1.4, 1.7, 0.9] }}
            transition={contactTransition}
            style={{ transformOrigin: `${x}px ${y}px` }}
          />
          <path
            d={`M ${x - 9} ${y - 5} V ${y - 9} H ${x - 5} M ${x + 5} ${y - 9} H ${x + 9} V ${y - 5} M ${x + 9} ${y + 5} V ${y + 9} H ${x + 5} M ${x - 5} ${y + 9} H ${x - 9} V ${y + 5}`}
            fill="none"
            stroke={tone}
            strokeWidth="1"
          />
        </>
      ) : null}
      <motion.circle
        cx={x}
        cy={y}
        r="3"
        fill={tone}
        animate={reduceMotion ? { opacity: 1 } : { opacity: [0.18, 0.18, 1, 0.34, 0.18] }}
        transition={contactTransition}
      />
      <text x={labelX} y={labelY} fontSize="6.5" letterSpacing="1.1" fill={tone} fontFamily="Space Mono, monospace">
        {id}
      </text>
      {lock ? (
        <text x={labelX} y={labelY + 10} fontSize="5.5" letterSpacing="1" fill="rgba(87,219,150,0.72)" fontFamily="Space Mono, monospace">
          LOCK
        </text>
      ) : null}
    </g>
  );
});

/* A single capsule label that always stays upright relative to the viewport.
   Outer rotation is the dial's `rot`; we counter-rotate by `(rot + angle)`
   so the text reads horizontally no matter where it sits on the ring. */
const LabelCapsule = memo(function LabelCapsule({ rot, text, angle, tone }) {
  const upright = useTransform(rot, (v) => -(v + angle));
  return (
    <g transform={`rotate(${angle}) translate(0,-${RADIUS})`}>
      <motion.g style={{ rotate: upright }}>
        {/* Outer halo for glow */}
        <rect
          x="-52"
          y="-13"
          width="104"
          height="26"
          rx="13"
          fill="rgba(6,9,31,0.55)"
        />
        {/* Capsule */}
        <rect
          x="-50"
          y="-12"
          width="100"
          height="24"
          rx="12"
          fill="rgba(6,9,31,0.92)"
          stroke={tone}
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        {/* Left/right bracket dots */}
        <circle cx="-44" cy="0" r="1.5" fill={tone} opacity="0.85" />
        <circle cx="44" cy="0" r="1.5" fill={tone} opacity="0.85" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="9.5"
          letterSpacing="2.2"
          fill={tone}
          fontFamily="Space Mono, monospace"
        >
          {text}
        </text>
      </motion.g>
    </g>
  );
});

const OrbitalDial = ({ progress }) => {
  const reduceMotion = useReducedMotion();
  // progress: MotionValue 0 → 1 mapped from the Orbital beat's local range
  const rot = useTransform(progress, [0, 1], [-90, 270]);
  const counterRot = useTransform(rot, (v) => -v);
  const scale = useTransform(progress, [0, 0.5, 1], [0.88, 1, 1.1]);
  const fade = useTransform(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);

  // Entry/exit remain scroll-bound; once visible, the scanner keeps operating.
  const sweepOpacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 0.6, 0.6, 0]);

  return (
    <motion.svg
      viewBox="-280 -280 560 560"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(86vmin,640px)] h-[min(86vmin,640px)]"
      style={{ opacity: fade, scale }}
      role="img"
      aria-label="Active radar plot tracking three system contacts with one locked target"
    >
      <title>Active radar plot: three contacts tracked, target one locked</title>
      <defs>
        <radialGradient id="dialCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(122,87,219,0.35)" />
          <stop offset="60%" stopColor="rgba(122,87,219,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient
          id="sweepGrad"
          gradientUnits="userSpaceOnUse"
          x1={SCAN_TRAIL_X}
          y1={SCAN_TRAIL_Y}
          x2="0"
          y2={-SCAN_RADIUS}
        >
          <stop offset="0%" stopColor="rgba(122,87,219,0.03)" />
          <stop offset="72%" stopColor="rgba(122,87,219,0.22)" />
          <stop offset="100%" stopColor="rgba(122,87,219,0.48)" />
        </linearGradient>
        <linearGradient
          id="sweepBeam"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={-SCAN_RADIUS}
        >
          <stop offset="0%" stopColor="rgba(155,128,245,0.06)" />
          <stop offset="72%" stopColor="rgba(155,128,245,0.42)" />
          <stop offset="100%" stopColor="rgba(155,128,245,0.75)" />
        </linearGradient>
      </defs>

      {/* Soft core glow centered behind the dial */}
      <circle r="240" fill="url(#dialCore)" />

      {/* Radar plot field */}
      <RadarGrid />

      {/* Sweeping radar wedge */}
      <motion.g
        data-testid="orbital-sweep"
        initial={{ rotate: 0 }}
        animate={{ rotate: reduceMotion ? 0 : 360 }}
        transition={reduceMotion ? { duration: 0 } : { duration: SCAN_DURATION, ease: "linear", repeat: Infinity }}
        style={{ opacity: sweepOpacity, transformBox: "fill-box", transformOrigin: "center" }}
        pointerEvents="none"
      >
        {/* Symmetric bounds keep Motion's fill-box rotation centered on the emitter. */}
        <circle r={SCAN_RADIUS} fill="rgba(0,0,0,0)" stroke="none" />
        <path
          data-testid="orbital-sweep-sector"
          d={SCAN_PATH}
          fill="url(#sweepGrad)"
        />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={-SCAN_RADIUS}
          stroke="url(#sweepBeam)"
          strokeWidth="1.4"
        />
      </motion.g>

      {/* Target tracks remain readable above the scanning energy */}
      <g>
        {RADAR_TARGETS.map((target) => (
          <RadarTarget key={target.id} {...target} reduceMotion={reduceMotion} />
        ))}
      </g>

      {/* Outermost rotating ring with ticks */}
      <motion.g style={{ rotate: rot }}>
        <circle r={RADIUS} fill="none" stroke="rgba(155,128,245,0.45)" strokeWidth="1" />
        <circle r={RADIUS + 8} fill="none" stroke="rgba(155,128,245,0.12)" strokeWidth="1" strokeDasharray="1 3" />
        <Ticks radius={RADIUS - 2} count={120} color="rgba(155,128,245,0.55)" length={5} />
      </motion.g>

      {/* Static (viewport-aligned) capsule labels — orbit but stay upright */}
      <motion.g style={{ rotate: rot }}>
        {labels.map((l) => (
          <LabelCapsule key={l.text} rot={rot} {...l} />
        ))}
      </motion.g>

      {/* Middle ring — slower counter-rotation */}
      <motion.g style={{ rotate: counterRot }}>
        <circle r="178" fill="none" stroke="rgba(51,194,204,0.28)" strokeDasharray="2 6" />
        <Ticks radius={178} count={60} color="rgba(51,194,204,0.4)" length={3} />
      </motion.g>

      {/* Fixed radar HUD and center emitter */}
      <g>
        {/* Cardinal ticks */}
        <line x1="-205" y1="0" x2="-198" y2="0" stroke="rgba(155,128,245,0.7)" strokeWidth="1.2" />
        <line x1="198" y1="0" x2="205" y2="0" stroke="rgba(155,128,245,0.7)" strokeWidth="1.2" />
        <line x1="0" y1="-205" x2="0" y2="-198" stroke="rgba(155,128,245,0.7)" strokeWidth="1.2" />
        <line x1="0" y1="198" x2="0" y2="205" stroke="rgba(155,128,245,0.7)" strokeWidth="1.2" />

        {/* Center emitter */}
        <circle r="22" fill="none" stroke="rgba(122,87,219,0.25)" />
        <circle r="14" fill="none" stroke="rgba(122,87,219,0.55)" />
        <circle r="6" fill="#7a57db" />
        <circle r="3" fill="#ffffff" opacity="0.9" />

        {/* Instrument readout rail */}
        <path d="M -105 196 H -72 M 72 196 H 105" stroke="rgba(51,194,204,0.42)" />
        <rect x="-68" y="184" width="136" height="27" rx="2" fill="rgba(3,4,18,0.84)" stroke="rgba(51,194,204,0.18)" />
        <text
          x="0"
          y="195"
          textAnchor="middle"
          fontSize="7.5"
          letterSpacing="2.8"
          fill="rgba(51,194,204,0.82)"
          fontFamily="Space Mono, monospace"
        >
          RADAR / ACTIVE
        </text>
        <text
          x="0"
          y="205"
          textAnchor="middle"
          fontSize="5.8"
          letterSpacing="1.6"
          fill="rgba(155,128,245,0.72)"
          fontFamily="Space Mono, monospace"
        >
          03 CONTACTS / 01 LOCK
        </text>
      </g>
    </motion.svg>
  );
};

export default memo(OrbitalDial);
