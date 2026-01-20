import { OrbitingCircles } from "./OrbitingCircles";
import { memo, useMemo } from "react";

const skills = [
  "auth0",
  "blazor",
  "cplusplus",
  "csharp",
  "css3",
  "dotnet",
  "dotnetcore",
  "git",
  "html5",
  "javascript",
  "microsoft",
  "react",
  "sqlite",
  "tailwindcss",
  "vitejs",
  "wordpress",
];

const Icon = memo(function Icon({ src }) {
  return (
    <img
      src={src}
      className="duration-200 rounded-sm hover:scale-110"
      loading="lazy"
      decoding="async"
      alt=""
    />
  );
});

export const Frameworks = memo(function Frameworks() {
  // Memoize reversed skills to prevent recalculation
  const reversedSkills = useMemo(() => [...skills].reverse(), []);

  return (
    <div className="relative flex h-[15rem] w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={40}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={25} radius={100} reverse speed={2}>
        {reversedSkills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
});
