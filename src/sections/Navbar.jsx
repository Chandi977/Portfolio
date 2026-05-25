import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";

const NAV_ITEMS = [
  { id: "home", label: "HOME", code: "01" },
  { id: "starlog", label: "STARLOG", code: "02" },
  { id: "about", label: "IDENTITY", code: "03" },
  { id: "freelance", label: "SERVICES", code: "04" },
  { id: "work", label: "DEPLOYMENTS", code: "05" },
  { id: "experience", label: "ARCHIVE", code: "06" },
  { id: "testimonial", label: "INTERCEPTS", code: "07" },
  { id: "contact", label: "UPLINK", code: "08" },
];

const NavItem = memo(function NavItem({ item, onClick, active }) {
  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={onClick}
        className="group flex items-center gap-2 py-2 px-2 transition-colors"
      >
        <span
          className={`font-mono-tight text-[10px] tracking-[0.2em] transition-colors ${
            active ? "text-lavender" : "text-neutral-600 group-hover:text-aqua"
          }`}
        >
          {item.code}
        </span>
        <span
          className={`font-mono-tight text-[11px] tracking-[0.28em] uppercase transition-colors ${
            active
              ? "text-white"
              : "text-neutral-400 group-hover:text-white"
          }`}
        >
          {item.label}
        </span>
      </a>
    </li>
  );
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [time, setTime] = useState("");

  // Scroll telemetry
  const { scrollYProgress } = useScroll();
  const smoothProg = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  // UTC clock for the navbar header
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss} UTC`);
    };
    fmt();
    const t = setInterval(fmt, 1000);
    return () => clearInterval(t);
  }, []);

  // Scrolled state + active section detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          // Cheap active-section detection
          const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean);
          const mid = window.innerHeight * 0.35;
          for (const s of sections) {
            const r = s.getBoundingClientRect();
            if (r.top <= mid && r.bottom >= mid) {
              setActive(s.id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const headerClass = useMemo(
    () =>
      `fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-primary/75 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`,
    [scrolled],
  );

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={headerClass}
    >
      {/* Top meta strip — frequency / clock / scroll telemetry */}
      <div className="hidden md:flex items-center justify-between gap-4 px-6 lg:px-12 py-1.5 border-b border-white/5">
        <div className="flex items-center gap-3 font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500">
          <span className="block w-2 h-2 rounded-full bg-mint shadow-[0_0_8px_#57db96]" />
          FREQ · 47.32MHz · BAND-S
        </div>
        <div className="font-mono-tight text-[10px] tracking-[0.3em] text-neutral-500">
          {time}
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex items-center justify-between py-3">
          {/* Callsign / logo */}
          <a href="#home" className="group flex items-center gap-3">
            <span className="relative flex items-center justify-center w-7 h-7 border border-lavender/50 rotate-45 group-hover:border-lavender transition-colors">
              <span className="absolute inset-1.5 bg-lavender/80 group-hover:bg-aqua transition-colors" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-mono-tight text-[9px] tracking-[0.3em] text-neutral-500">
                CALLSIGN
              </span>
              <span className="font-display-tight text-lg text-white tracking-[-0.02em]">
                CHARAN · 977
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.id} item={item} active={active === item.id} />
              ))}
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={handleToggle}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-white/10 hover:border-lavender/50 transition-colors"
            aria-label="Toggle menu"
          >
            <span className="font-mono-tight text-[10px] tracking-[0.3em] text-neutral-300">
              {isOpen ? "CLOSE" : "MENU"}
            </span>
            <span className="flex flex-col gap-1">
              <span
                className={`block w-4 h-px bg-white transition-transform ${isOpen ? "rotate-45 translate-y-[3px]" : ""}`}
              />
              <span
                className={`block w-4 h-px bg-white transition-transform ${isOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}
              />
            </span>
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="h-px bg-gradient-to-r from-lavender via-aqua to-coral origin-left"
          style={{ scaleX: smoothProg }}
        />
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden lg:hidden bg-primary/95 backdrop-blur-xl border-b border-white/5"
          >
            <ul className="flex flex-col py-4 px-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="border-b border-white/5 last:border-0">
                  <a
                    href={`#${item.id}`}
                    onClick={handleClose}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tight text-[10px] tracking-[0.2em] text-lavender">
                        {item.code}
                      </span>
                      <span className="font-mono-tight text-xs tracking-[0.28em] text-white uppercase">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-neutral-600">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default memo(Navbar);
