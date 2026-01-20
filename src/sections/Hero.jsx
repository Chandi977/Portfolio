import { Canvas, useFrame } from "@react-three/fiber";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/parallaxBackground";
import { Astronaut } from "../components/Astronaut";
import { Float } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { easing } from "maath";
import { Suspense, memo, useMemo } from "react";
import Loader from "../components/Loader";

// Memoized Rig component to prevent unnecessary re-renders
const Rig = memo(function Rig() {
  return useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.mouse.x / 10, 1 + state.mouse.y / 10, 3],
      0.5,
      delta,
    );
  });
});

// Memoized Astronaut wrapper
const MemoizedAstronaut = memo(Astronaut);

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });

  // Memoize astronaut props to prevent re-renders
  const astronautProps = useMemo(
    () => ({
      scale: isMobile ? 0.23 : 0.3,
      position: isMobile ? [0, -1.5, 0] : [1.3, -1, 0],
    }),
    [isMobile],
  );

  // Memoize canvas settings for better performance
  const canvasProps = useMemo(
    () => ({
      camera: { position: [0, 1, 3] },
      dpr: [1, 2], // Limit device pixel ratio for performance
      performance: { min: 0.5 }, // Allow frame rate to drop for complex scenes
      gl: {
        antialias: true,
        powerPreference: "high-performance",
      },
    }),
    [],
  );

  return (
    <section
      id="home"
      className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start c-space"
    >
      <HeroText />
      <ParallaxBackground />
      <figure
        className="absolute inset-0"
        style={{ width: "100vw", height: "100vh", willChange: "transform" }}
      >
        <Canvas {...canvasProps}>
          <Suspense fallback={<Loader />}>
            <Float floatIntensity={0.5} speed={1.5}>
              <MemoizedAstronaut {...astronautProps} />
            </Float>
            <Rig />
          </Suspense>
        </Canvas>
      </figure>
    </section>
  );
};

export default memo(Hero);
