import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import {
  PinnedStage,
  Beat,
  MonoLabel,
  StatusDot,
  Hairline,
  useSubProgress,
} from "../components/starlog/ds";
import { interpolate } from "../hooks/useGSAPBeat";

/* ============================================================
   TRANSMISSION 08 // UPLINK
   400vh pinned. Four beats — a terminal boot sequence:
     1) BOOT      0.00 → 0.20
     2) HANDSHAKE 0.20 → 0.40
     3) FIELDS    0.40 → 0.80  — form fields type in one at a time
     4) ACTIVE    0.80 → 1.00  — form interactive, TRANSMIT button glows
   ============================================================ */

const BOOT_LINES = [
  "> npm run contact",
  "> tls handshake :: OK",
  "> opening tcp://contact:443",
  "> negotiating http/2 keep-alive",
  "> auth user :: chandi.charan.dev",
  "> ready",
];

const HANDSHAKE_SYSTEMS = [
  { code: "TLS", label: "ENCRYPTION", tone: "lavender" },
  { code: "AUTH", label: "AUTHENTICATION", tone: "aqua" },
  { code: "API", label: "API SERVER", tone: "mint" },
];

const Contact = () => (
  <PinnedStage
    id="contact"
    index="08"
    callsign="CONTACT"
    tone="mint"
    height={400}
    beatLabels={["BOOT", "HANDSHAKE", "FIELDS", "ACTIVE"]}
  >
    {(p) => <ContactBeats p={p} />}
  </PinnedStage>
);

const ContactBeats = ({ p }) => {
  // Sub-progress ranges complete before each beat's fade-out so reveals
  // finish with dwell time on screen.
  const bootP = useSubProgress(p, 0, 0.16);
  const shakeP = useSubProgress(p, 0.22, 0.36);
  const fieldsP = useSubProgress(p, 0.42, 0.76);
  const activeP = useSubProgress(p, 0.78, 0.88);

  // Track whether form should be interactive (after beat 4 starts)
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    if (!activeP) return;
    return activeP.onChange((v) => setInteractive(v > 0.05));
  }, [activeP]);

  return (
    <>
      {/* ════ BEAT 1 — BOOT ════ */}
      <Beat progress={p} range={[0, 0, 0.20, 0.25]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <div className="w-full max-w-2xl border border-white/10 starlog-clip bg-primary p-6 md:p-8">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="block w-2.5 h-2.5 rounded-full bg-coral" />
                <span className="block w-2.5 h-2.5 rounded-full bg-sand" />
                <span className="block w-2.5 h-2.5 rounded-full bg-mint" />
                <MonoLabel className="ml-3">~/contact $ ./init.sh</MonoLabel>
              </div>
              <MonoLabel tone="lavender">BOOTING</MonoLabel>
            </div>

            <ul className="space-y-2">
              {BOOT_LINES.map((line, i) => (
                <BootLine key={i} line={line} index={i} total={BOOT_LINES.length} bootP={bootP} />
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <MonoLabel>PROGRESS</MonoLabel>
                <MonoLabel tone="aqua">
                  <BootPercent bootP={bootP} />
                </MonoLabel>
              </div>
              <BootBar bootP={bootP} />
            </div>
          </div>
        </div>
      </Beat>

      {/* ════ BEAT 2 — HANDSHAKE ════ */}
      <Beat progress={p} range={[0.20, 0.25, 0.40, 0.45]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <MonoLabel tone="aqua" className="mb-8">::HANDSHAKE · 08.02</MonoLabel>
          <h3 className="font-display-tight italic text-4xl md:text-6xl text-white tracking-[-0.04em] mb-12 max-w-3xl">
            Connection established.
          </h3>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl w-full">
            {HANDSHAKE_SYSTEMS.map((s, i) => (
              <SystemLight key={s.code} system={s} index={i} shakeP={shakeP} />
            ))}
          </div>

          <FadeIn progress={shakeP} start={0.55} end={0.70}>
            <p className="mt-12 font-mono-tight text-xs tracking-[0.35em] text-mint uppercase">
              ✓ ALL SYSTEMS GREEN
            </p>
          </FadeIn>
        </div>
      </Beat>

      {/* ════ BEAT 3+4 — FORM ════ */}
      <Beat progress={p} range={[0.40, 0.46, 1.0, 1.0]}>
        <ContactForm
          fieldsP={fieldsP}
          activeP={activeP}
          interactive={interactive}
        />
      </Beat>

      {/* Signoff hairline */}
      <Beat progress={p} range={[0.92, 0.95, 1.0, 1.0]}>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[min(640px,80vw)] z-30">
          <Hairline />
          <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
            <span>END · MODULE 08</span>
            <span>↓ END · OF · LOG</span>
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

/* ---------- BootLine ---------- */
const BootLine = memo(function BootLine({ line, index, total, bootP }) {
  const ref = useRef(null);
  // Tighter cascade: last line lands at sub-progress ~0.65 (was ~0.90)
  const start = (index / total) * 0.60;
  const end = start + 0.05;

  useEffect(() => {
    if (!bootP) return;
    return bootP.onChange((p) => {
      const el = ref.current;
      if (!el) return;
      el.style.opacity = interpolate(p, [start, end], [0, 1]);
      el.style.transform = `translateX(${interpolate(p, [start, end], [-10, 0])}px)`;
    });
  }, [bootP, start, end]);

  return (
    <li
      ref={ref}
      style={{ opacity: 0, willChange: "transform, opacity" }}
      className="font-mono-tight text-xs md:text-sm text-neutral-300 flex items-center gap-2"
    >
      <span className="text-mint">{line.slice(0, 1)}</span>
      <span className="text-neutral-300">{line.slice(2)}</span>
    </li>
  );
});

/* ---------- BootPercent ---------- */
const BootPercent = memo(function BootPercent({ bootP }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!bootP) return;
    return bootP.onChange((v) => setPct(Math.min(100, Math.round(interpolate(v, [0, 0.70], [0, 100])))));
  }, [bootP]);
  return <>{String(pct).padStart(3, "0")}%</>;
});

/* ---------- BootBar ---------- */
const BootBar = memo(function BootBar({ bootP }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!bootP) return;
    return bootP.onChange((p) => {
      if (ref.current) ref.current.style.width = `${interpolate(p, [0, 0.70], [0, 100])}%`;
    });
  }, [bootP]);
  return (
    <div className="h-1 bg-white/10 relative overflow-hidden">
      <div
        ref={ref}
        style={{ width: "0%" }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-mint"
      />
    </div>
  );
});

/* ---------- SystemLight ---------- */
const SystemLight = memo(function SystemLight({ system, index, shakeP }) {
  const outerRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const okRef = useRef(null);

  // Tighter cascade: last system lands at sub-progress ~0.47 (was ~0.62)
  const start = 0.05 + index * 0.16;
  const end = start + 0.10;

  useEffect(() => {
    if (!shakeP) return;
    return shakeP.onChange((p) => {
      const opacity = interpolate(p, [start - 0.05, start + 0.05], [0, 1]);
      const lit = interpolate(p, [start, end], [0, 1]);
      const ringScale = interpolate(p, [start, end], [0.6, 1]);

      if (outerRef.current) outerRef.current.style.opacity = opacity;
      if (ringRef.current) {
        ringRef.current.style.opacity = lit;
        ringRef.current.style.transform = `scale(${ringScale})`;
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = lit;
        dotRef.current.style.transform = `scale(${lit})`;
      }
      if (okRef.current) okRef.current.style.opacity = lit;
    });
  }, [shakeP, start, end]);

  const toneMap = {
    lavender: { dot: "bg-lavender", text: "text-lavender", ring: "border-lavender", shadow: "shadow-[0_0_24px_rgba(122,87,219,0.7)]" },
    aqua: { dot: "bg-aqua", text: "text-aqua", ring: "border-aqua", shadow: "shadow-[0_0_24px_rgba(51,194,204,0.7)]" },
    mint: { dot: "bg-mint", text: "text-mint", ring: "border-mint", shadow: "shadow-[0_0_24px_rgba(87,219,150,0.7)]" },
  }[system.tone];

  return (
    <div ref={outerRef} style={{ opacity: 0 }} className="flex flex-col items-center text-center">
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10 flex items-center justify-center">
        <span
          ref={ringRef}
          style={{ opacity: 0 }}
          className={`absolute inset-0 rounded-full border-2 ${toneMap.ring} ${toneMap.shadow}`}
        />
        <span
          ref={dotRef}
          style={{ opacity: 0, transform: "scale(0)" }}
          className={`block w-3 h-3 rounded-full ${toneMap.dot}`}
        />
      </div>
      <span className={`mt-4 font-mono-tight text-[10px] tracking-[0.3em] ${toneMap.text}`}>
        {system.code}
      </span>
      <span className="mt-1 font-mono-tight text-[11px] tracking-[0.22em] text-neutral-400 uppercase">
        {system.label}
      </span>
      <span
        ref={okRef}
        style={{ opacity: 0 }}
        className="mt-2 font-mono-tight text-[9px] tracking-[0.25em] text-mint"
      >
        ✓ OK
      </span>
    </div>
  );
});

/* ---------- ContactForm ---------- */
const ContactForm = memo(function ContactForm({ fieldsP, activeP, interactive }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const showMsg = useCallback((type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        await emailjs.send(
          "service_79b0nyj",
          "template_17us8im",
          {
            from_name: formData.name,
            to_name: "Chandi Charan Mahato",
            from_email: formData.email,
            to_email: "charan.f.sde@gmail.com",
            message: formData.message,
          },
          "pn-Bw_mS1_QQdofuV",
        );
        setIsLoading(false);
        setFormData({ name: "", email: "", message: "" });
        showMsg("success", "Message received. I'll reply soon.");
      } catch (error) {
        setIsLoading(false);
        console.error("Email sending failed:", error);
        showMsg("danger", "Request failed. Please try again.");
      }
    },
    [formData, showMsg],
  );

  const btnRef = useRef(null);
  useEffect(() => {
    if (!activeP) return;
    return activeP.onChange((p) => {
      if (btnRef.current) btnRef.current.style.opacity = interpolate(p, [0, 1], [0.35, 1]);
    });
  }, [activeP]);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 z-20">
      {showAlert && <Alert type={alertType} text={alertMessage} />}

      <div className="w-full max-w-3xl border border-white/10 starlog-clip bg-gradient-to-br from-primary via-midnight to-primary p-6 md:p-9">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="block w-2.5 h-2.5 rounded-full bg-coral" />
            <span className="block w-2.5 h-2.5 rounded-full bg-sand" />
            <span className="block w-2.5 h-2.5 rounded-full bg-mint" />
            <MonoLabel className="ml-3">~/contact $ POST /api/message</MonoLabel>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot tone={interactive ? "mint" : "aqua"} />
            <MonoLabel tone={interactive ? "mint" : "aqua"}>
              {interactive ? "READY" : "TYPING…"}
            </MonoLabel>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <ScrollField
            label="USER · NAME" code="08.01" id="name" name="name" type="text"
            placeholder="enter your name…" value={formData.name} onChange={handleChange}
            range={[0.00, 0.25]} fieldsP={fieldsP} interactive={interactive}
          />
          <ScrollField
            label="EMAIL · ADDRESS" code="08.02" id="email" name="email" type="email"
            placeholder="you@example.com" value={formData.email} onChange={handleChange}
            range={[0.25, 0.55]} fieldsP={fieldsP} interactive={interactive}
          />
          <ScrollField
            label="YOUR · MESSAGE" code="08.03" id="message" name="message"
            placeholder="what are you building? what do you need? when?"
            value={formData.message} onChange={handleChange}
            range={[0.55, 0.95]} fieldsP={fieldsP} interactive={interactive} textarea
          />

          <Hairline className="my-7" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <StatusDot tone="lavender" />
              <MonoLabel tone="lavender">
                BODY · {formData.message.length} CHARS
              </MonoLabel>
            </div>
            <motion.button
              ref={btnRef}
              type="submit"
              disabled={!interactive || isLoading}
              whileHover={interactive ? { scale: 1.02 } : undefined}
              whileTap={interactive ? { scale: 0.98 } : undefined}
              style={{ opacity: 0.35 }}
              className="group relative inline-flex items-center justify-between gap-4 border border-mint/50 hover:border-mint hover:bg-mint/5 px-6 py-3 transition-all disabled:cursor-not-allowed min-w-[240px] shadow-[0_0_24px_-12px_rgba(87,219,150,0.6)]"
            >
              <span className="font-mono-tight text-xs tracking-[0.32em] text-white uppercase">
                {isLoading ? "SENDING…" : "▶ SEND"}
              </span>
              <span className="text-mint">
                {isLoading ? (
                  <span className="inline-block w-3 h-3 border-2 border-mint border-t-transparent rounded-full animate-spin" />
                ) : (
                  "↗"
                )}
              </span>
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
});

/* ---------- ScrollField ---------- */
const ScrollField = memo(function ScrollField({
  label, code, id, name, type = "text", placeholder, value, onChange,
  range, fieldsP, interactive, textarea = false,
}) {
  const wrapRef = useRef(null);
  const cursorRef = useRef(null);
  const [a, b] = range;

  useEffect(() => {
    if (!fieldsP) return;
    return fieldsP.onChange((p) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      wrap.style.opacity = interpolate(p, [a, a + 0.05], [0, 1]);
      wrap.style.transform = `translateY(${interpolate(p, [a, a + 0.05], [16, 0])}px)`;

      if (cursorRef.current) {
        cursorRef.current.style.width = `${interpolate(p, [a, b], [0, 100])}%`;
      }
    });
  }, [fieldsP, a, b]);

  return (
    <div ref={wrapRef} style={{ opacity: 0, willChange: "transform, opacity" }} className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <MonoLabel tone="lavender">{code} · {label}</MonoLabel>
        <span className="font-mono-tight text-[9px] tracking-[0.25em] text-neutral-600">REQUIRED</span>
      </div>
      <div className="starlog-input-wrap relative">
        {textarea ? (
          <textarea
            id={id} name={name} rows="4" className="starlog-input"
            placeholder={placeholder} value={value} onChange={onChange}
            required disabled={!interactive}
          />
        ) : (
          <input
            id={id} name={name} type={type} className="starlog-input"
            placeholder={placeholder} value={value} onChange={onChange}
            autoComplete={name} required disabled={!interactive}
          />
        )}

        {!interactive && (
          <div
            ref={cursorRef}
            aria-hidden
            style={{ width: "0%" }}
            className="absolute left-6 right-0 bottom-3 h-px bg-aqua/60 overflow-hidden pointer-events-none"
          >
            <span className="absolute right-0 top-[-12px] block w-[2px] h-3 bg-aqua animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
});

export default memo(Contact);
