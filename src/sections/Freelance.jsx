import { memo } from "react";
import CopyEmailButton from "../components/CopyEmailButton";
import { freelanceDetails, freelanceServices } from "../constants";

const Freelance = memo(function Freelance() {
  return (
    <section className="c-space section-spacing" id="freelance">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Freelance
            </p>
            <h2 className="text-heading text-4xl md:text-5xl">
              Available for selected freelance work
            </h2>
            <p className="subtext max-w-3xl">
              I help teams ship production-grade experiences - from zero-to-one
              builds to hardening existing platforms. If you need someone who
              can own backend, frontend, and cloud, let's talk.
            </p>
          </div>
          <CopyEmailButton />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {freelanceServices.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-storm/70 to-indigo/70 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="mb-3 text-2xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="mb-4 text-neutral-300">{service.description}</p>
              <ul className="space-y-2 text-sm text-neutral-400">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-lavender" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {freelanceDetails.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-white/10 bg-primary/70 p-5"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                {detail.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Freelance;
