export const mySocials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/chandi-charan-mahato-3631a7178/",
    icon: "/assets/socials/linkedIn.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/_chara.n_/", // Replace if you use a different handle
    icon: "/assets/socials/instagram.svg",
  },
  {
    name: "GitHub",
    href: "https://github.com/Chandi977",
    icon: "/assets/socials/github.svg", // Make sure this icon exists in your assets
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/Chandi977/",
    icon: "/assets/socials/leetcode.svg", // Add an icon if you have one for LeetCode
  },
];

export const freelanceServices = [
  {
    title: "Build & Ship",
    description:
      "Full-cycle ownership for MVPs, dashboards, and B2B products - from architecture to launch.",
    points: [
      "MERN and cloud-native stacks",
      "Secure auth, APIs, and integrations",
      "Performance, observability, and scaling",
    ],
  },
  {
    title: "Improve & Optimize",
    description:
      "Drop in to stabilize existing products, tame tech debt, and accelerate delivery.",
    points: [
      "Audit and refactor critical paths",
      "Caching, queues, and real-time systems",
      "CI/CD, monitoring, and cost control",
    ],
  },
  {
    title: "Consult & Partner",
    description:
      "Bring me in for architecture reviews, roadmaps, and hands-on guidance for your team.",
    points: [
      "System design workshops",
      "Technical spikes and proofs",
      "Ongoing technical leadership",
    ],
  },
];

export const freelanceDetails = [
  { label: "Availability", value: "Open for select remote projects" },
  { label: "Engagements", value: "Project-based, retainers, or sprints" },
  { label: "Response Time", value: "Replies within 1-2 business days" },
];

// constants.js

export const myProjects = [
  {
    id: 1,
    title: "URL Shortener Service – Scalable MERN Application",
    category: "Full Stack Development",
    description:
      "A scalable URL shortening platform built with the MERN stack, featuring analytics, expiration, rate limiting, background workers, and Redis-based caching using FlashKV and Upstash.",
    fullDescription:
      "A production-grade URL shortener optimized for high traffic and low latency. Uses Redis (Upstash) for caching and queues, BullMQ for background processing, and worker threads for async jobs such as analytics and cleanup.",
    features: [
      "Custom short URL generation",
      "High-speed redirection with Redis & FlashKV",
      "JWT-based authentication & authorization",
      "Rate limiting & abuse prevention",
      "Click analytics processed asynchronously",
      "Background workers for cleanup & metrics",
      "Centralized logging",
    ],
    technologies: [
      // Core Stack
      "MongoDB",
      "Mongoose",
      "Express.js",
      "React.js",
      "Node.js",

      // Authentication & Security
      "JWT Authentication",
      "UUID",
      "Input Validation",

      // Caching & Queues
      "Async Processing",

      // Caching & Performance
      "FlashKV (Custom Redis-like Cache)",
      "TTL & Expiry Handling",

      // Rate Limiting & Reliability
      "express-rate-limit",
      "Retry Strategies",

      // Logging & Observability
      "Winston Logger",

      // Cloud & DevOps
      "AWS EC2",
      "AWS S3",
      "AWS IAM",
      "Environment Variables (.env)",

      // Architecture
      "REST APIs",
      "System Design",
      "Git & GitHub",
    ],
    image: "/assets/projects/Url-shortner.webp",
    href: "https://github.com/Chandi977/MERN_URL_shortner",
    github: "https://github.com/Chandi977/MERN_URL_shortner",
    stats: {
      year: "2024",
      duration: "2 months",
      role: "Full Stack Developer",
    },
  },

  {
    id: 2,
    title: "FlashKV – High-Performance In-Memory Key-Value Store",
    category: "Systems Engineering",
    description:
      "A Redis-inspired in-memory key–value store built in C++ focusing on concurrency, low latency, and cache internals.",
    fullDescription:
      "FlashKV is a multithreaded, in-memory key–value store implemented from scratch in C++ with TTL-based expiration and thread-safe operations.",
    features: [
      "Thread-safe in-memory storage",
      "SET, GET, DELETE, EXPIRE operations",
      "TTL-based key expiration",
      "Multithreaded request handling",
      "Optimized data structures",
    ],
    technologies: [
      "C++17",
      "STL (unordered_map, vector, deque)",
      "Multithreading",
      "Concurrency Control",
      "Mutex & Atomic Operations",
      "Socket Programming",
      "Custom Protocol Parsing",
      "TTL & Expiry Algorithms",
      "In-Memory Databases",
      "Low-Latency Systems",
      "System Design",
    ],
    image: "/assets/projects/FlashKv.webp",
    href: "https://github.com/Chandi977/FlashKv",
    github: "https://github.com/Chandi977/FlashKv",
    stats: {
      year: "2024",
      duration: "1 month",
      role: "Systems Developer",
    },
  },

  {
    id: 3,
    title: "YouTube Clone – End-to-End Video Streaming Platform",
    category: "Full Stack Development",
    description:
      "A full-stack video streaming platform supporting secure uploads, transcoding, authentication, and scalable media delivery.",
    fullDescription:
      "Handles video uploads, background transcoding using FFmpeg, cloud storage, and authenticated streaming with scalable backend APIs.",
    features: [
      "Secure video upload & streaming",
      "FFmpeg-based video transcoding",
      "Background processing with workers",
      "JWT authentication",
      "Cloud media storage",
    ],
    technologies: [
      // Core
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",

      // Media Processing
      "FFmpeg",
      "Video Transcoding Pipelines",

      // Async & Workers
      "BullMQ",
      "Background Workers",
      "Redis (Upstash)",

      // Security & Utilities
      "JWT Authentication",
      "UUID",

      // Cloud
      "Cloudinary",
      "AWS S3",

      // Observability
      "Winston Logger",

      // Architecture
      "REST APIs",
      "MVC Architecture",
      "Git & GitHub",
    ],
    image: "/assets/projects/youtube.webp",
    href: "https://client-nine-green-46.vercel.app/",
    github: "https://github.com/Chandi977/Youtube-frontend",
    stats: {
      year: "2024",
      duration: "2 months",
      role: "Full Stack Developer",
    },
  },

  {
    id: 4,
    title: "Zenith – AR Emergency Route Simulator (Android)",
    category: "Backend & Mobile Systems",
    description:
      "An Android-based emergency navigation application providing real-time ambulance tracking, traffic-aware routing, and emergency notifications.",
    fullDescription:
      "Zenith is an Android application built using Flutter and Dart, backed by a Node.js, Express, and MongoDB backend. The system provides real-time ambulance tracking, optimized routing using traffic data, and instant emergency notifications through a scalable, event-driven backend.",
    features: [
      "Android application built with Flutter",
      "Real-time ambulance tracking",
      "Traffic-aware route optimization",
      "WebSocket-based live updates",
      "Emergency notifications",
      "Asynchronous backend processing",
    ],
    technologies: [
      // Mobile (Android)
      "Flutter",
      "Dart",
      "Android Platform",

      // Backend
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",

      // Real-Time & Messaging
      "WebSockets",
      "Event-Driven Architecture",
      "Firebase Cloud Messaging",

      // Maps & Algorithms
      "Google Maps API",
      "Google Places API",
      "A* Pathfinding Algorithm",

      // Async & Infrastructure
      "Redis",
      "Background Workers",

      // Architecture & DevOps
      "REST APIs",
      "System Design",
      "AWS EC2",
    ],
    image: "/assets/projects/zenith-ar.jpg",
    href: "https://github.com/Chandi977/AR-Based-Emergency-Route-Simulator",
    github: "https://github.com/Chandi977/AR-Based-Emergency-Route-Simulator",
    stats: {
      year: "2025",
      duration: "Ongoing",
      role: "Backend Developer",
    },
  },

  {
    id: 5,
    title: "Speakbot Command Following Bot",
    category: "Automation & API Integration",
    description:
      "A Python-based assistant bot capable of executing voice and text commands using multiple third-party APIs.",
    fullDescription:
      "Integrates speech processing and multiple APIs to automate information retrieval and command execution.",
    features: [
      "Voice-based commands",
      "Weather & location lookup",
      "Wikipedia & movie search",
      "Automation workflows",
    ],
    technologies: [
      "Python",
      "REST APIs",
      "OpenWeather API",
      "Wikipedia API",
      "Geolocation APIs",
      "Speech-to-Text",
      "Text-to-Speech",
      "Automation Scripts",
    ],
    image: "/assets/projects/speakbot.webp",
    href: "https://github.com/Chandi977/Speakbot-Command-Following-Bot",
    github: "https://github.com/Chandi977/Speakbot-Command-Following-Bot",
    stats: {
      year: "2023",
      duration: "1 month",
      role: "Developer",
    },
  },

  {
    id: 6,
    title: "Banjara Tour & Travel",
    category: "Web Development",
    description:
      "A complete travel agency website built using core PHP with booking and inquiry features.",
    fullDescription:
      "A dynamic PHP-based travel platform with server-side rendering and database-driven content.",
    features: [
      "Tour package management",
      "Booking & inquiry forms",
      "Session-based authentication",
      "Responsive UI",
    ],
    technologies: [
      "Core PHP",
      "HTML5",
      "CSS3",
      "JavaScript",
      "MySQL",
      "Session Handling",
      "Form Validation",
      "XAMPP",
      "Git",
    ],
    image: "/assets/projects/banjara.webp",
    href: "https://github.com/Chandi977/Banjara-Tour-and-Travel",
    github: "https://github.com/Chandi977/Banjara-Tour-and-Travel",
    stats: {
      year: "2022",
      duration: "2 months",
      role: "Backend Developer",
    },
  },

  {
    id: 7,
    title: "Netflix Clone",
    category: "Frontend Development",
    description:
      "A Netflix UI clone built using React with Firebase authentication.",
    fullDescription:
      "Frontend-focused project replicating Netflix UI with cloud-based authentication.",
    features: [
      "User authentication",
      "Dynamic UI rendering",
      "Protected routes",
      "Responsive design",
    ],
    technologies: [
      "React.js",
      "Firebase Authentication",
      "Firebase Firestore",
      "JavaScript (ES6)",
      "CSS3",
      "REST APIs",
      "Git & GitHub",
    ],
    image: "/assets/projects/netflix.webp",
    href: "https://github.com/Chandi977/Netflixclone",
    github: "https://github.com/Chandi977/Netflixclone",
    stats: {
      year: "2022",
      duration: "1 month",
      role: "Frontend Developer",
    },
  },
];

export const reviews = [
  {
    name: "Sanskar",
    username: "@sanskar",
    body: "Impressive work! The UI/UX is clean and the performance is top-notch.",
    img: "https://robohash.org/sanskar",
  },
  {
    name: "Aditya",
    username: "@aditya",
    body: "The functionality is seamless. I loved the integration and smooth transitions.",
    img: "https://robohash.org/aditya",
  },
  {
    name: "Riya",
    username: "@riya",
    body: "Super intuitive and visually appealing. It’s a joy to explore your projects!",
    img: "https://robohash.org/riya",
  },
  {
    name: "Suraj",
    username: "@suraj",
    body: "Clean code, elegant design, and outstanding implementation. Great job!",
    img: "https://robohash.org/suraj",
  },
  {
    name: "Anurag",
    username: "@anurag",
    body: "Everything from responsiveness to functionality is top-level. Keep building!",
    img: "https://robohash.org/anurag",
  },
  {
    name: "Neha",
    username: "@neha",
    body: "Absolutely love the attention to detail and design aesthetics!",
    img: "https://robohash.org/neha",
  },
  {
    name: "Priyanshu",
    username: "@priyanshu",
    body: "Your work truly stands out! Impressed by the backend architecture.",
    img: "https://robohash.org/priyanshu",
  },
  {
    name: "Jyoti",
    username: "@jyoti",
    body: "Incredible creativity and execution. The user experience is flawless.",
    img: "https://robohash.org/jyoti",
  },
  {
    name: "Kabir",
    username: "@kabir",
    body: "Loved it. Very polished and professional—feels like a real product.",
    img: "https://robohash.org/kabir",
  },
  {
    name: "Anjul",
    username: "@anjul",
    body: "Elegant, fast, and reliable. It’s inspiring to see such work!",
    img: "https://robohash.org/anjul",
  },
];

// constants.js

export const experiences = [
  {
    date: "Dec 2025 - Present",
    title: "Full Stack Developer",
    job: "Prem Packaging (Prem Industries India Ltd.)",
    location: "Ghaziabad, Uttar Pradesh, India",
    type: "Full-time",
    description:
      "Full Stack Developer working on production-grade backend services and cloud-hosted business systems.",
    contents: [
      "Developed and maintained 5+ production-grade backend services supporting product catalogs, order workflows, and administrative operations.",
      "Designed and optimized 15+ REST APIs using Node.js, Express, and MongoDB with support for search, filtering, and role-based access control.",
      "Integrated AWS services (EC2, S3, CloudFront, IAM) to deploy and operate backend services with high availability and secure access.",
      "Implemented Redis-based caching to reduce repeated database queries by approximately 40%.",
      "Deployed and maintained frontend builds via AWS Amplify while ensuring reliable backend connectivity.",
      "Diagnosed and resolved 20+ production issues related to environment configuration, IAM permissions, and database connectivity.",
    ],
    achievements: [
      "Reduced average API response times by 30–40% through caching and query optimization",
      "Improved system reliability by resolving critical production configuration issues",
      "Contributed to stable backend services supporting daily business operations",
    ],
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Redis",
      "AWS EC2",
      "AWS S3",
      "AWS CloudFront",
      "AWS IAM",
      "AWS Amplify",
      "REST APIs",
      "Git & GitHub",
    ],
    metrics: [
      {
        value: "15+",
        label: "REST APIs designed and maintained",
      },
      {
        value: "30–40%",
        label: "API latency reduction",
      },
    ],
    website: "https://www.prempackaging.com",
    certificate: "",
  },

  {
    date: "Aug 2025 - Nov 2025",
    title: "MERN Stack Developer",
    job: "GeeksforGeeks (Internship)",
    location: "Remote",
    type: "Internship",
    description:
      "MERN stack internship focused on building secure backend services and responsive client interfaces.",
    contents: [
      "Built 5+ end-to-end MERN-based systems with secure authentication and role-based access control.",
      "Implemented JWT-based authentication across multiple backend services.",
      "Developed 20+ reusable React components and optimized state management to reduce unnecessary re-renders.",
      "Designed and integrated RESTful APIs and connected third-party services for real-world scenarios.",
      "Solved 200+ data structures and algorithms problems alongside project development.",
    ],
    achievements: [
      "Delivered multiple full-stack systems with secure authentication",
      "Improved frontend performance through reusable component architecture",
      "Strengthened backend security using JWT-based access control",
    ],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT",
      "REST APIs",
      "JavaScript (ES6+)",
      "Git & GitHub",
    ],
    metrics: [
      {
        value: "5+",
        label: "End-to-end systems delivered",
      },
      {
        value: "20+",
        label: "Reusable frontend components built",
      },
    ],
    website: "https://www.geeksforgeeks.org",
    certificate: "",
  },

  {
    date: "Jun 2025",
    title: "Software Engineering Virtual Experience",
    job: "J.P. Morgan Chase & Co. (Forage)",
    location: "Virtual",
    type: "Virtual Experience",
    description:
      "Virtual software engineering experience simulating enterprise-scale financial systems.",
    contents: [
      "Completed 4 real-world simulation tasks involving data visualization, frontend enhancements, and bug fixes.",
      "Built a stock price data feed interface using Python, React, and TypeScript.",
      "Processed and visualized large financial data streams using enterprise-style tooling.",
      "Gained exposure to scalable systems used in investment banking technology.",
    ],
    achievements: [
      "Delivered a functional real-time data visualization interface",
      "Developed familiarity with enterprise financial systems",
    ],
    technologies: [
      "Python",
      "React",
      "TypeScript",
      "Data Visualization",
      "Financial Systems",
    ],
    metrics: [
      {
        value: "4",
        label: "Enterprise simulation tasks completed",
      },
    ],
    website: "https://www.theforage.com",
    certificate: "",
  },

  {
    date: "Oct 2021 - Nov 2021",
    title: "Web Development Intern",
    job: "Adityapur Auto Cluster (AAC)",
    location: "Jamshedpur, Jharkhand",
    type: "Internship",
    description:
      "Frontend-focused internship contributing to internal digital systems.",
    contents: [
      "Implemented 10+ responsive user interface screens using HTML5, CSS3, and Flexbox.",
      "Built static pages and forms used within internal digital systems.",
      "Improved visual consistency by standardizing CSS and reusable layout patterns.",
      "Collaborated in code reviews and resolved UI-related defects.",
    ],
    achievements: [
      "Delivered multiple responsive interfaces for internal use",
      "Improved frontend maintainability through standardized styling",
    ],
    technologies: [
      "HTML5",
      "CSS3",
      "Flexbox",
      "JavaScript",
      "Responsive Design",
    ],
    metrics: [
      {
        value: "10+",
        label: "UI screens delivered",
      },
    ],
    website: "",
    certificate: "",
  },
];
