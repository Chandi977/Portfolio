import { memo, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const NAV_ITEMS = [
  { id: "starlog", label: "Changelog" },
  { id: "about", label: "Profile" },
  { id: "freelance", label: "Services" },
  { id: "work", label: "Deployments" },
  { id: "experience", label: "Experience" },
  { id: "testimonial", label: "Reviews" },
];

const TRACKED_SECTION_IDS = [
  "home",
  ...NAV_ITEMS.map((item) => item.id),
  "contact",
];

const renderNavLink = (item, active, onClick) => {
  const isActive = active === item.id;

  return (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        onClick={onClick}
        aria-current={isActive ? "location" : undefined}
        className={`relative flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          isActive
            ? "bg-white/[0.09] text-white"
            : "text-neutral-300 hover:bg-white/[0.05] hover:text-white"
        }`}
      >
        {item.label}
        {isActive && (
          <span
            aria-hidden="true"
            className="absolute inset-x-4 -bottom-px h-px bg-lavender"
          />
        )}
      </a>
    </li>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);

        const marker = window.innerHeight * 0.32;
        for (const id of TRACKED_SECTION_IDS) {
          const section = document.getElementById(id);
          if (!section) continue;

          const bounds = section.getBoundingClientRect();
          if (bounds.top <= marker && bounds.bottom >= marker) {
            setActive(id);
            break;
          }
        }

        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen((open) => !open), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
      }
      className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6"
    >
      <div
        className={`mx-auto flex h-[4.25rem] max-w-6xl items-center gap-3 rounded-full border px-3 pl-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-4 sm:pl-5 ${
          scrolled || isOpen
            ? "border-white/[0.12] bg-primary/85 shadow-[0_18px_52px_rgba(3,4,18,0.42)] backdrop-blur-2xl"
            : "border-white/[0.1] bg-primary/40 shadow-[0_8px_36px_rgba(3,4,18,0.2)] backdrop-blur-lg"
        }`}
      >
        <a
          href="#home"
          onClick={handleClose}
          aria-label="Charan Mahato, back to home"
          className="group flex min-h-11 shrink-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] font-body text-xs font-semibold tracking-[0.08em] text-white transition-colors duration-200 group-hover:border-lavender/45 group-hover:bg-lavender/15">
            CM
          </span>
          <span className="flex flex-col">
            <span className="font-body text-[13px] font-semibold tracking-[-0.02em] text-white sm:text-sm">
              Charan Mahato
            </span>
            <span className="hidden text-[11px] font-medium tracking-[0.08em] text-neutral-400 sm:block">
              Full-stack engineer
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="mx-auto hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => renderNavLink(item, active))}
          </ul>
        </nav>

        <a
          href="#contact"
          onClick={handleClose}
          aria-current={active === "contact" ? "location" : undefined}
          className={`ml-auto hidden min-h-11 shrink-0 items-center rounded-full px-5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 xl:flex ${
            active === "contact"
              ? "bg-lavender text-white"
              : "bg-white text-primary hover:bg-neutral-100"
          }`}
        >
          Contact
        </a>

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          className="ml-auto flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 xl:hidden"
        >
          <span>{isOpen ? "Close" : "Menu"}</span>
          <span aria-hidden="true" className="flex w-4 flex-col gap-[5px]">
            <span
              className={`h-px w-full bg-current transition-transform duration-200 ${
                isOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-transform duration-200 ${
                isOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
            }
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/[0.12] bg-primary/95 p-2 shadow-[0_24px_68px_rgba(3,4,18,0.58)] backdrop-blur-2xl xl:hidden"
          >
            <ul className="grid gap-1 sm:grid-cols-2">
              {NAV_ITEMS.map((item) =>
                renderNavLink(item, active, handleClose),
              )}
            </ul>
            <a
              href="#contact"
              onClick={handleClose}
              className="mt-2 flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Contact
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default memo(Navbar);
