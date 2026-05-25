import { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { interpolate } from "../hooks/useGSAPBeat";

gsap.registerPlugin(ScrollTrigger);

const ParallaxBackground = memo(function ParallaxBackground() {
  const containerRef = useRef(null);
  const mountain3Ref = useRef(null);
  const planetsRef = useRef(null);
  const mountain2Ref = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      scrub: 0,
      onUpdate: (self) => {
        const p = self.progress;
        if (mountain3Ref.current) mountain3Ref.current.style.transform = `translateY(${interpolate(p, [0, 1], [0, 60])}%)`;
        if (planetsRef.current) planetsRef.current.style.transform = `translateX(${interpolate(p, [0, 1], [0, -15])}%)`;
        if (mountain2Ref.current) mountain2Ref.current.style.transform = `translateY(${interpolate(p, [0, 1], [0, 25])}%)`;
      },
    });

    return () => st.kill();
  }, []);

  const baseStyle = {
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    willChange: "transform",
  };

  return (
    <section ref={containerRef} className="pointer-events-none absolute inset-0 bg-black/40">
      <div className="relative h-full overflow-hidden">
        {/* Background Sky - Static */}
        <div
          className="absolute inset-0 h-full w-full -z-50"
          style={{
            backgroundImage: "url(/assets/sky.webp)",
            backgroundPosition: "bottom",
            backgroundSize: "cover",
          }}
        />
        {/* Mountain Layer 3 */}
        <div
          ref={mountain3Ref}
          className="absolute inset-0 -z-40"
          style={{ backgroundImage: "url(/assets/mountain-3.webp)", ...baseStyle }}
        />
        {/* Planets */}
        <div
          ref={planetsRef}
          className="absolute inset-0 -z-30"
          style={{ backgroundImage: "url(/assets/planets.webp)", ...baseStyle }}
        />
        {/* Mountain Layer 2 */}
        <div
          ref={mountain2Ref}
          className="absolute inset-0 -z-20"
          style={{ backgroundImage: "url(/assets/mountain-2.webp)", ...baseStyle }}
        />
        {/* Mountain Layer 1 — static foreground */}
        <div
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: "url(/assets/mountain-1.webp)", ...baseStyle }}
        />
      </div>
    </section>
  );
});

export default ParallaxBackground;
