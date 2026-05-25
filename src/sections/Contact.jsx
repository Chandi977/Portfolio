import { useState, useEffect, useCallback, memo } from "react";
import { motion, useTransform } from "motion/react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import {
  PinnedStage,
  Beat,
  MonoLabel,
  StatusDot,
  Hairline,
} from "../components/starlog/ds";

/* ============================================================
   TRANSMISSION 08 // UPLINK
   400vh pinned. Four beats — a terminal boot sequence:
     1) BOOT      0.00 → 0.20
     2) HANDSHAKE 0.20 → 0.40
     3) FIELDS    0.40 → 0.80  — form fields type in one at a time
     4) ACTIVE    0.80 → 1.00  — form interactive, TRANSMIT button glows
   ============================================================ */

const BOOT_LINES = [
  "> mounting /dev/uplink",
  "> handshake.aes256 :: OK",
  "> opening channel · 47.32MHz",
  "> negotiating bitrate · 9600/baud",
  "> linking peer :: chandi.charan.977",
  "> ready",
];

const HANDSHAKE_SYSTEMS = [
  { code: "ENC", label: "ENCRYPTION", tone: "lavender" },
  { code: "AUTH", label: "AUTHENTICATION", tone: "aqua" },
  { code: "RX", label: "RECEIVER", tone: "mint" },
];

const Contact = () => (
  <PinnedStage
    id="contact"
    index="08"
    callsign="UPLINK"
    tone="mint"
    height={400}
    beatLabels={["BOOT", "HANDSHAKE", "FIELDS", "ACTIVE"]}
  >
    {(p) => <ContactBeats p={p} />}
  </PinnedStage>
);

/** Subscribe to a MotionValue and call cb whenever it changes */
function useReadMV(mv, cb) {
  useEffect(() => {
    cb(mv.get());
    return mv.on("change", cb);
  }, [mv, cb]);
}

const ContactBeats = ({ p }) => {
  const bootP = useTransform(p, [0, 0.20], [0, 1], { clamp: true });
  const shakeP = useTransform(p, [0.20, 0.40], [0, 1], { clamp: true });
  const fieldsP = useTransform(p, [0.40, 0.80], [0, 1], { clamp: true });
  const activeP = useTransform(p, [0.78, 0.86], [0, 1], { clamp: true });

  const bootBarW = useTransform(bootP, [0, 0.9], ["0%", "100%"]);
  const btnOpacity = useTransform(activeP, [0, 1], [0.35, 1]);

  // The form panel stays mounted from beat 3 onwards.
  // Track whether it should be interactive (after beat 4 starts).
  const [interactive, setInteractive] = useState(false);
  useReadMV(activeP, (v) => setInteractive(v > 0.05));

  return (
    <>
      {/* ════ BEAT 1 — BOOT ════ */}
      <Beat progress={p} range={[0, 0, 0.18, 0.22]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12">
          <div className="w-full max-w-2xl border border-white/10 starlog-clip bg-primary p-6 md:p-8">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="block w-2.5 h-2.5 rounded-full bg-coral" />
                <span className="block w-2.5 h-2.5 rounded-full bg-sand" />
                <span className="block w-2.5 h-2.5 rounded-full bg-mint" />
                <MonoLabel className="ml-3">/uplink/boot.sh</MonoLabel>
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
              <div className="h-1 bg-white/10 relative overflow-hidden">
                <motion.div
                  style={{ width: bootBarW }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-lavender via-aqua to-mint"
                />
              </div>
            </div>
          </div>
        </div>
      </Beat>

      {/* ════ BEAT 2 — HANDSHAKE ════ */}
      <Beat progress={p} range={[0.18, 0.22, 0.38, 0.42]}>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <MonoLabel tone="aqua" className="mb-8">::HANDSHAKE · 08.02</MonoLabel>
          <h3 className="font-display-tight italic text-4xl md:text-6xl text-white tracking-[-0.04em] mb-12 max-w-3xl">
            Channel opening.
          </h3>

          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl w-full">
            {HANDSHAKE_SYSTEMS.map((s, i) => (
              <SystemLight key={s.code} system={s} index={i} shakeP={shakeP} />
            ))}
          </div>

          <motion.p
            style={{ opacity: useTransform(shakeP, [0.75, 1], [0, 1]) }}
            className="mt-12 font-mono-tight text-xs tracking-[0.35em] text-mint uppercase"
          >
            ✓ ALL SYSTEMS NOMINAL
          </motion.p>
        </div>
      </Beat>

      {/* ════ BEAT 3+4 — FORM (single mount, fades in once) ════ */}
      <Beat progress={p} range={[0.38, 0.44, 1.0, 1.0]}>
        <ContactForm
          fieldsP={fieldsP}
          btnOpacity={btnOpacity}
          interactive={interactive}
        />
      </Beat>

      {/* Signoff hairline (during last 10%) */}
      <Beat progress={p} range={[0.92, 0.95, 1.0, 1.0]}>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[min(640px,80vw)] z-30">
          <Hairline />
          <div className="mt-3 flex justify-between font-mono-tight text-[10px] tracking-[0.4em] text-neutral-500">
            <span>END · TRANSMISSION 08</span>
            <span>↓ END · OF · FEED</span>
          </div>
        </div>
      </Beat>
    </>
  );
};

/* ---------- BootLine ---------- */
const BootLine = memo(function BootLine({ line, index, total, bootP }) {
  const start = (index / total) * 0.85;
  const end = start + 0.05;
  const opacity = useTransform(bootP, [start, end], [0, 1], { clamp: true });
  const x = useTransform(bootP, [start, end], [-10, 0], { clamp: true });
  return (
    <motion.li
      style={{ opacity, x }}
      className="font-mono-tight text-xs md:text-sm text-neutral-300 flex items-center gap-2"
    >
      <span className="text-mint">{line.slice(0, 1)}</span>
      <span className="text-neutral-300">{line.slice(2)}</span>
    </motion.li>
  );
});

const BootPercent = memo(function BootPercent({ bootP }) {
  const [pct, setPct] = useState(0);
  useReadMV(bootP, (v) => setPct(Math.round(v * 100)));
  return <>{String(pct).padStart(3, "0")}%</>;
});

/* ---------- SystemLight ---------- */
const SystemLight = memo(function SystemLight({ system, index, shakeP }) {
  const start = 0.1 + index * 0.2;
  const end = start + 0.12;
  const lit = useTransform(shakeP, [start, end], [0, 1], { clamp: true });
  const ringScale = useTransform(shakeP, [start, end], [0.6, 1], { clamp: true });
  const opacity = useTransform(shakeP, [start - 0.05, start + 0.05], [0, 1], { clamp: true });

  const toneMap = {
    lavender: { dot: "bg-lavender", text: "text-lavender", ring: "border-lavender", shadow: "shadow-[0_0_24px_rgba(122,87,219,0.7)]" },
    aqua: { dot: "bg-aqua", text: "text-aqua", ring: "border-aqua", shadow: "shadow-[0_0_24px_rgba(51,194,204,0.7)]" },
    mint: { dot: "bg-mint", text: "text-mint", ring: "border-mint", shadow: "shadow-[0_0_24px_rgba(87,219,150,0.7)]" },
  }[system.tone];

  return (
    <motion.div style={{ opacity }} className="flex flex-col items-center text-center">
      <motion.div
        style={{ scale: ringScale }}
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/10 flex items-center justify-center"
      >
        <motion.span
          style={{ opacity: lit }}
          className={`absolute inset-0 rounded-full border-2 ${toneMap.ring} ${toneMap.shadow}`}
        />
        <motion.span
          style={{ opacity: lit, scale: lit }}
          className={`block w-3 h-3 rounded-full ${toneMap.dot}`}
        />
      </motion.div>
      <span className={`mt-4 font-mono-tight text-[10px] tracking-[0.3em] ${toneMap.text}`}>
        {system.code}
      </span>
      <span className="mt-1 font-mono-tight text-[11px] tracking-[0.22em] text-neutral-400 uppercase">
        {system.label}
      </span>
      <motion.span
        style={{ opacity: lit }}
        className="mt-2 font-mono-tight text-[9px] tracking-[0.25em] text-mint"
      >
        ✓ OK
      </motion.span>
    </motion.div>
  );
});

/* ---------- ContactForm — single mount, fades in once ---------- */
const ContactForm = memo(function ContactForm({ fieldsP, btnOpacity, interactive }) {
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
        showMsg("success", "Uplink received. I'll reply soon.");
      } catch (error) {
        setIsLoading(false);
        console.error("Email sending failed:", error);
        showMsg("danger", "Transmission failed. Please try again.");
      }
    },
    [formData, showMsg],
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12 z-20">
      {showAlert && <Alert type={alertType} text={alertMessage} />}

      <div className="w-full max-w-3xl border border-white/10 starlog-clip bg-gradient-to-br from-primary via-midnight to-primary p-6 md:p-9">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="block w-2.5 h-2.5 rounded-full bg-coral" />
            <span className="block w-2.5 h-2.5 rounded-full bg-sand" />
            <span className="block w-2.5 h-2.5 rounded-full bg-mint" />
            <MonoLabel className="ml-3">/uplink/transmit.sh</MonoLabel>
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
            label="CALLSIGN · NAME"
            code="08.01"
            id="name"
            name="name"
            type="text"
            placeholder="enter your name…"
            value={formData.name}
            onChange={handleChange}
            range={[0.00, 0.25]}
            fieldsP={fieldsP}
            interactive={interactive}
          />
          <ScrollField
            label="RETURN · ADDRESS"
            code="08.02"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            range={[0.25, 0.55]}
            fieldsP={fieldsP}
            interactive={interactive}
          />
          <ScrollField
            label="PAYLOAD · MESSAGE"
            code="08.03"
            id="message"
            name="message"
            placeholder="what are you building? what do you need? when?"
            value={formData.message}
            onChange={handleChange}
            range={[0.55, 0.95]}
            fieldsP={fieldsP}
            interactive={interactive}
            textarea
          />

          <Hairline className="my-7" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <StatusDot tone="lavender" />
              <MonoLabel tone="lavender">
                PAYLOAD · {formData.message.length} BYTES
              </MonoLabel>
            </div>
            <motion.button
              type="submit"
              disabled={!interactive || isLoading}
              whileHover={interactive ? { scale: 1.02 } : undefined}
              whileTap={interactive ? { scale: 0.98 } : undefined}
              style={{ opacity: btnOpacity }}
              className="group relative inline-flex items-center justify-between gap-4 border border-mint/50 hover:border-mint hover:bg-mint/5 px-6 py-3 transition-all disabled:cursor-not-allowed min-w-[240px] shadow-[0_0_24px_-12px_rgba(87,219,150,0.6)]"
            >
              <span className="font-mono-tight text-xs tracking-[0.32em] text-white uppercase">
                {isLoading ? "TRANSMITTING…" : "▶ TRANSMIT"}
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

/* ---------- ScrollField — appears typed in based on fieldsP ---------- */
const ScrollField = memo(function ScrollField({
  label,
  code,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  range,
  fieldsP,
  interactive,
  textarea = false,
}) {
  const [a, b] = range;
  const opacity = useTransform(fieldsP, [a, a + 0.05], [0, 1], { clamp: true });
  const y = useTransform(fieldsP, [a, a + 0.05], [16, 0], { clamp: true });
  const typeW = useTransform(fieldsP, [a, b], ["0%", "100%"], { clamp: true });

  return (
    <motion.div style={{ opacity, y }} className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <MonoLabel tone="lavender">{code} · {label}</MonoLabel>
        <span className="font-mono-tight text-[9px] tracking-[0.25em] text-neutral-600">REQUIRED</span>
      </div>
      <div className="starlog-input-wrap relative">
        {textarea ? (
          <textarea
            id={id}
            name={name}
            rows="4"
            className="starlog-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required
            disabled={!interactive}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            className="starlog-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={name}
            required
            disabled={!interactive}
          />
        )}

        {!interactive && (
          <motion.div
            style={{ width: typeW }}
            aria-hidden
            className="absolute left-6 right-0 bottom-3 h-px bg-aqua/60 overflow-hidden pointer-events-none"
          >
            <span className="absolute right-0 top-[-12px] block w-[2px] h-3 bg-aqua animate-pulse" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default memo(Contact);
