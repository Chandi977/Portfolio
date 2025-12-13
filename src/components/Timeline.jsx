"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="c-space section-spacing" ref={containerRef}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20 space-y-4"
      >
        <h2 className="text-heading">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <p className="max-w-3xl text-xl text-neutral-400">
          A journey through my professional career, highlighting key roles,
          achievements, and the technologies I've mastered along the way.
        </p>
      </motion.div>

      <div ref={ref} className="relative pb-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* Timeline Node */}
            <div className="sticky z-40 flex flex-col items-center self-start max-w-xs md:flex-row top-40 lg:max-w-sm md:w-full">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[15px] bg-midnight">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="w-4 h-4 p-2 border rounded-full bg-neutral-800 border-neutral-700"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-lavender" />
                </motion.div>
              </div>

              {/* Desktop: Date and Title on Left */}
              <div className="flex-col hidden gap-3 text-xl font-bold md:flex md:pl-20 text-neutral-300">
                <div className="space-y-3">
                  {/* Date Badge */}
                  <div className="inline-block px-4 py-2 border rounded-lg bg-gradient-to-r from-purple-500/10 to-lavender/10 border-purple-500/30">
                    <h3 className="text-base font-semibold text-purple-400">
                      {item.date}
                    </h3>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-3xl font-bold leading-tight text-neutral-200">
                    {item.title}
                  </h3>

                  {/* Company Name */}
                  <h3 className="text-xl font-semibold text-neutral-300">
                    {item.job}
                  </h3>

                  {/* Location & Type */}
                  <div className="flex flex-col gap-2 pt-2">
                    {item.location && (
                      <p className="flex items-center gap-2 text-sm text-neutral-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-purple-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {item.location}
                      </p>
                    )}
                    {item.type && (
                      <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 w-fit">
                        {item.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative w-full pl-20 pr-4 md:pl-4">
              {/* Mobile: Date and Title on Top */}
              <div className="block mb-6 space-y-3 md:hidden">
                {/* Date Badge */}
                <div className="inline-block px-4 py-2 border rounded-lg bg-gradient-to-r from-purple-500/10 to-lavender/10 border-purple-500/30">
                  <h3 className="text-sm font-semibold text-purple-400">
                    {item.date}
                  </h3>
                </div>

                {/* Job Title */}
                <h3 className="text-2xl font-bold text-neutral-200">
                  {item.title}
                </h3>

                {/* Company Name */}
                <h3 className="text-lg font-semibold text-neutral-300">
                  {item.job}
                </h3>

                {/* Location & Type */}
                <div className="flex flex-col gap-2">
                  {item.location && (
                    <p className="flex items-center gap-2 text-sm text-neutral-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {item.location}
                    </p>
                  )}
                  {item.type && (
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 w-fit">
                      {item.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Experience Card */}
              <div className="relative p-6 space-y-6 border rounded-xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/50 border-neutral-800 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />

                {/* Description */}
                {item.description && (
                  <div className="relative">
                    <p className="text-lg leading-relaxed text-neutral-300 font-medium">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Key Stats/Metrics - Show prominently at top if available */}
                {item.metrics && item.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-neutral-900/50 border-neutral-800">
                    {item.metrics.map((metric, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-500/5 to-lavender/5 hover:from-purple-500/10 hover:to-lavender/10 transition-all"
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-lavender bg-clip-text text-transparent mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Responsibilities/Contents */}
                {item.contents && item.contents.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-purple-500 to-lavender" />
                      <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300">
                        Key Responsibilities
                      </h4>
                    </div>
                    <ul className="space-y-3 pl-1">
                      {item.contents.map((content, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-start gap-3 group"
                        >
                          <span className="mt-1.5 text-purple-400 group-hover:text-purple-300 transition-colors text-lg">
                            ▹
                          </span>
                          <span className="leading-relaxed text-neutral-300 group-hover:text-neutral-200 transition-colors">
                            {content}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-lavender to-purple-500" />
                      <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300">
                        Key Achievements
                      </h4>
                    </div>
                    <ul className="space-y-3 pl-1">
                      {item.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          className="flex items-start gap-3 group"
                        >
                          <span className="mt-0.5 text-lavender group-hover:text-purple-300 transition-colors text-lg">
                            ★
                          </span>
                          <span className="leading-relaxed text-neutral-300 group-hover:text-neutral-200 transition-colors font-medium">
                            {achievement}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies/Skills */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="pt-4 space-y-4 border-t border-neutral-800">
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300">
                        Technologies & Tools
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: idx * 0.02 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-4 py-2 text-sm font-semibold transition-all duration-300 border rounded-lg bg-neutral-800/70 text-neutral-200 border-neutral-700 hover:border-purple-500/50 hover:bg-neutral-800 hover:shadow-lg hover:shadow-purple-500/10"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(item.website || item.certificate) && (
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-neutral-800">
                    {item.website && (
                      <motion.a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 border rounded-lg text-neutral-300 hover:text-purple-400 border-neutral-700 hover:border-purple-500/50 bg-neutral-800/50 hover:bg-neutral-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Company Website
                      </motion.a>
                    )}
                    {item.certificate && (
                      <motion.a
                        href={item.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 border rounded-lg text-neutral-300 hover:text-purple-400 border-neutral-700 hover:border-purple-500/50 bg-neutral-800/50 hover:bg-neutral-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        View Certificate
                      </motion.a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Animated Timeline Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-1 left-1 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-lavender/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
