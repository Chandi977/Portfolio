import { Timeline } from "../components/Timeline";
import { experiences } from "../constants";
import { memo } from "react";

const Experiences = memo(function Experiences() {
  return (
    <section id="experience" className="w-full c-space section-spacing">
      <div className="mx-auto max-w-7xl">
        <Timeline data={experiences} />
      </div>
    </section>
  );
});

export default Experiences;
