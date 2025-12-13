import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { myProjects } from "../constants";

const ProjectCard = ({ project, index, setPreview }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => {
        setIsHovered(true);
        setPreview(project.image);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setPreview(null);
      }}
      className="relative group cursor-pointer"
    >
      {/* Divider */}
      <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
        {/* Left Side - Project Number & Title */}
        <div className="lg:col-span-3 space-y-4">
          <motion.span
            className="text-6xl font-bold text-neutral-800 dark:text-neutral-200"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-400 uppercase tracking-wider">
            {project.category || "Web Development"}
          </p>
        </div>

        {/* Middle - Description & Details */}
        <div className="lg:col-span-6 space-y-6">
          <p className="text-lg text-neutral-300 leading-relaxed">
            {project.description || project.desc}
          </p>

          {/* Additional Details */}
          {project.fullDescription && (
            <p className="text-base text-neutral-400 leading-relaxed">
              {project.fullDescription}
            </p>
          )}

          {/* Key Features */}
          {project.features && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                Key Features
              </h4>
              <ul className="space-y-2">
                {project.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-neutral-400"
                  >
                    <span className="text-blue-400 mt-1">▹</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-4">
            {project.technologies?.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium bg-neutral-800/50 text-neutral-300 rounded-full border border-neutral-700 hover:border-blue-400 transition-colors duration-300"
              >
                {tech}
              </span>
            )) ||
              // Fallback if technologies aren't in the data
              project.subdesc?.split(",").map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium bg-neutral-800/50 text-neutral-300 rounded-full border border-neutral-700 hover:border-blue-400 transition-colors duration-300"
                >
                  {tech.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* Right Side - Links & Stats */}
        <div className="lg:col-span-3 space-y-6">
          {/* Project Links */}
          <div className="space-y-3">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors duration-300 group/link"
              >
                <span className="text-sm font-medium">View Project</span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </motion.svg>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors duration-300"
              >
                <span className="text-sm font-medium">Source Code</span>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>

          {/* Project Stats (optional) */}
          {project.stats && (
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              {project.stats.year && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Year</span>
                  <span className="text-neutral-300 font-medium">
                    {project.stats.year}
                  </span>
                </div>
              )}
              {project.stats.duration && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Duration</span>
                  <span className="text-neutral-300 font-medium">
                    {project.stats.duration}
                  </span>
                </div>
              )}
              {project.stats.role && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Role</span>
                  <span className="text-neutral-300 font-medium">
                    {project.stats.role}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

const Projects = () => {
  const [preview, setPreview] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation with better responsiveness
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Image dimensions
    const imgWidth = 384; // w-96 = 384px
    const imgHeight = 256; // h-64 = 256px

    // Calculate position with offset and boundaries
    let newX = e.clientX + 20;
    let newY = e.clientY + 20;

    // Keep image within viewport bounds
    if (newX + imgWidth > viewportWidth) {
      newX = e.clientX - imgWidth - 20;
    }
    if (newY + imgHeight > viewportHeight) {
      newY = e.clientY - imgHeight - 20;
    }

    // Ensure minimum distance from edges
    newX = Math.max(20, Math.min(newX, viewportWidth - imgWidth - 20));
    newY = Math.max(20, Math.min(newY, viewportHeight - imgHeight - 20));

    mouseX.set(newX);
    mouseY.set(newY);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative c-space section-spacing overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-16"
        >
          <h2 className="text-heading text-5xl md:text-6xl font-bold">
            Selected <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl">
            A collection of my recent work showcasing expertise in web
            development, design, and innovative solutions.
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="space-y-4">
          {myProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              setPreview={setPreview}
            />
          ))}
        </div>

        {/* Bottom Divider */}
        <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full mt-12" />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Projects;
