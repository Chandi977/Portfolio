import { useRef, memo, useMemo } from "react";
import Card from "../components/Card";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Frameworks } from "../components/Frameworks";

// Memoized card data to prevent re-creation
const cardData = [
  { style: { rotate: "75deg", top: "30%", left: "20%" }, text: "MERN Stack" },
  {
    style: { rotate: "-30deg", top: "60%", left: "45%" },
    text: "DSA & Algorithms",
  },
  {
    style: { rotate: "90deg", bottom: "30%", left: "70%" },
    text: "System Design",
  },
  { style: { rotate: "-45deg", top: "55%", left: "0%" }, text: "MongoDB" },
  { style: { rotate: "20deg", top: "10%", left: "38%" }, text: "React.js" },
  { style: { rotate: "30deg", top: "70%", left: "70%" }, text: "AWS Cloud" },
  {
    style: { rotate: "-45deg", top: "70%", left: "25%" },
    text: "Redis / Caching",
  },
  { style: { rotate: "-45deg", top: "5%", left: "10%" }, text: "WebSockets" },
];

const About = () => {
  const grid2Container = useRef();
  return (
    <section className="mt-20" id="about">
      <h2 className="text-heading">About Me</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* Grid 1 */}
        <div className="flex items-end grid-default-color grid-1">
          <img
            src="assets/coding-pov.png"
            className="absolute scale-[1.75] -right-[5rem] -top-[1rem] md:scale-[3] md:left-50 md:inset-y-10 lg:scale-[2.5]"
            alt="Coding POV"
            loading="lazy"
            decoding="async"
          />
          <div className="z-10">
            <p className="headtext">Hi, I'm Chandi Charan Mahato</p>
            <p className="subtext">
              I'm a Full-Stack & Backend-focused Developer specializing in MERN
              Stack, scalable backend systems, and cloud-native applications. I
              enjoy building production-grade platforms, optimizing performance,
              and solving system-design problems using real-world architectures.
            </p>
          </div>
          <div className="absolute inset-x-0 pointer-events-none -bottom-4 h-1/2 sm:h-1/3 bg-gradient-to-t from-indigo" />
        </div>

        {/* Grid 2 */}
        <div className="grid-default-color grid-2">
          <div
            ref={grid2Container}
            className="flex items-center justify-center w-full h-full"
          >
            <p className="flex items-end text-5xl text-gray-500">
              CODE IS CRAFT
            </p>
            {cardData.map((card, index) => (
              <Card
                key={index}
                style={card.style}
                text={card.text}
                containerRef={grid2Container}
              />
            ))}
          </div>
        </div>

        {/* Grid 3 */}
        <div className="grid-black-color grid-3 flex items-center justify-between relative">
          <div className="flex items-center w-full h-full gap-2 px-6">
            <div className="z-10 flex flex-col justify-center w-1/2 min-w-[180px]">
              <p className="headtext">Time Zone</p>
              <p className="subtext">
                I'm based in India and open to remote work worldwide
              </p>
            </div>
            <figure className="flex justify-center items-center w-1/2 min-w-[180px]">
              <Globe />
            </figure>
          </div>
        </div>

        {/* Grid 4 */}
        <div className="grid-special-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">
              Do you want to start a project together?
            </p>
            <CopyEmailButton />
          </div>
        </div>

        {/* Grid 5 */}
        <div className="grid-default-color grid-5">
          <div className="z-10 w-[50%]">
            <p className="subtext">
              I work across the full development lifecycle using MongoDB,
              Express.js, React.js, and Node.js. My backend experience includes
              REST API design, authentication with JWT, caching with Redis
              (FlashKV), real-time systems using WebSockets, and cloud
              deployment on AWS (EC2, S3, CloudFront, IAM, Amplify). I also
              actively practice Data Structures, Algorithms, and System Design
              to build scalable and reliable systems.
            </p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:scale-125">
            <Frameworks />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(About);
