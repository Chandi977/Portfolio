import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   useScrollProgress — a lightweight reactive scroll-progress
   primitive powered by GSAP ScrollTrigger.

   Returns a progress object with:
     .get()           → current progress 0..1
     .onChange(cb)     → subscribe to changes, returns unsub fn
     .scrollTrigger    → the raw GSAP ScrollTrigger instance

   Usage:
     const p = useScrollProgress(containerRef, {
       start: "start start",
       end: "end end",
     });
   ============================================================ */

export default function useScrollProgress(containerRef, options = {}) {
  const progressRef = useRef(0);
  const listenersRef = useRef(new Set());
  const stRef = useRef(null);

  const get = useCallback(() => progressRef.current, []);

  const onChange = useCallback((cb) => {
    listenersRef.current.add(cb);
    // Immediately fire with current value
    cb(progressRef.current);
    return () => listenersRef.current.delete(cb);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const {
      start = "top top",
      end = "bottom bottom",
      pin = false,
      pinSpacing = true,
      scrub = true,
      markers = false,
    } = options;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      pin,
      pinSpacing,
      scrub: scrub === true ? 0 : scrub,
      markers,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        for (const cb of listenersRef.current) {
          cb(self.progress);
        }
      },
    });

    stRef.current = st;

    return () => {
      st.kill();
      stRef.current = null;
    };
    // options is typically a stable object literal; containerRef is a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  return {
    get,
    onChange,
    get scrollTrigger() {
      return stRef.current;
    },
  };
}
