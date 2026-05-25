import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";

/* ============================================================
   Lenis smooth-scroll wrapper
   - Gives the page real inertia / momentum scrolling
   - Updates window.scrollY natively → useScroll (motion/react)
     and ScrollTrigger (GSAP) both see the real scroll position
   - Syncs to GSAP's ticker so ScrollTrigger and Lenis share
     the same RAF loop (no double-rAF overhead)
   - Exposes the Lenis instance via context so any component
     can call `lenis.scrollTo('#id')` for programmatic scrolling
   ============================================================ */

const NAV_OFFSET = 96;

// Context — any descendant can grab the Lenis instance
const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── Create Lenis ──────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.07,           // lower = more inertia (0.06–0.1 sweet spot)
      duration: 1.2,         // base duration for scrollTo animations
      smoothWheel: true,     // smooth mouse-wheel scrolling
      wheelMultiplier: 1,    // 1:1 wheel distance
      touchMultiplier: 1.5,  // slight boost for trackpad swipes
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
    });

    lenisRef.current = lenis;

    // ── Sync Lenis → GSAP ticker ──────────────────────────
    // Single shared RAF loop: GSAP's ticker drives Lenis.
    // This ensures ScrollTrigger and Lenis never fight.
    gsap.ticker.lagSmoothing(0);
    const tickerCallback = (time) => {
      lenis.raf(time * 1000); // GSAP passes seconds, Lenis expects ms
    };
    gsap.ticker.add(tickerCallback);

    // Disable Lenis's own internal RAF — GSAP's ticker is driving it
    // (Lenis v1.x: calling raf() manually is the intended pattern
    //  when autoRaf is not set or set to false.)

    // ── Anchor-click handler ──────────────────────────────
    const onClick = (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const anchor =
        e.target.closest && e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: -NAV_OFFSET });
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onClick);

    // ── Hash on load / popstate ───────────────────────────
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      // Defer past initial layout so pinned sections measure correctly
      requestAnimationFrame(() => {
        lenis.scrollTo(target, { offset: -NAV_OFFSET, immediate: false });
      });
    };

    if (window.location.hash) {
      setTimeout(scrollToHash, 80);
    }
    window.addEventListener("hashchange", scrollToHash);

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", scrollToHash);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
};

export default SmoothScroll;
