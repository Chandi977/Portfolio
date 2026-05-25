import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_OFFSET = 96;

const scrollToId = (id, lenis) => {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
  return true;
};

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis = null;
    let removeTicker = null;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => gsap.ticker.remove(tick);
    }

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target.closest && e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (scrollToId(id, lenis)) {
        history.replaceState(null, "", href);
      }
    };
    document.addEventListener("click", onClick);

    // Handle initial load hash and back/forward navigation
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (id) {
        requestAnimationFrame(() => scrollToId(id, lenis));
      }
    };
    if (window.location.hash) {
      // Defer past initial layout so sections measure correctly
      setTimeout(onHashChange, 50);
    }
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      if (removeTicker) removeTicker();
      if (lenis) lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
