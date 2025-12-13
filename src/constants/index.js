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

export const myProjects = [
  {
    id: 1,
    title: "URL Shortener Service – Scalable MERN Application",
    description:
      "A full-stack URL shortening service built with the MERN stack, featuring custom short links, analytics, expiration handling, rate limiting, and Redis-based caching using FlashKV for high-performance redirection.",
    href: "https://github.com/Chandi977/MERN_URL_shortner",
    image: "/assets/projects/url-shortener.png",
    tags: [
      { id: 1, name: "MERN", path: "/assets/logos/mern.svg" },
      { id: 2, name: "Redis / FlashKV", path: "/assets/logos/redis.svg" },
      { id: 3, name: "JWT", path: "/assets/logos/jwt.svg" },
      { id: 4, name: "Caching", path: "/assets/logos/cache.svg" },
      { id: 5, name: "System Design", path: "/assets/logos/system-design.svg" },
    ],
  },

  {
    id: 2,
    title: "FlashKV – High-Performance In-Memory Key-Value Store",
    description:
      "A custom-built, Redis-inspired in-memory key–value store developed in C++ to understand low-latency data systems, concurrency, and cache design. Supports core data operations with thread-safe execution and TTL-based expiration.",
    href: "https://github.com/Chandi977/FlashKv",
    image: "/assets/projects/flashkv.png",
    tags: [
      { id: 1, name: "C++", path: "/assets/logos/cpp.svg" },
      { id: 2, name: "Multithreading", path: "/assets/logos/thread.svg" },
      { id: 3, name: "Concurrency", path: "/assets/logos/concurrency.svg" },
      {
        id: 4,
        name: "Systems Design",
        path: "/assets/logos/system-design.svg",
      },
    ],
  },

  {
    id: 3,
    title: "YouTube Clone – End-to-End Video Streaming Platform",
    description:
      "A full-stack, production-grade video streaming platform built with the MERN stack, supporting secure video uploads, streaming, user authentication, subscriptions, and scalable backend architecture.",
    href: "https://github.com/Chandi977/Youtube-frontend",
    image: "/assets/projects/youtube.png",
    tags: [
      { id: 1, name: "React", path: "/assets/logos/react.svg" },
      { id: 2, name: "Node.js", path: "/assets/logos/nodejs.svg" },
      { id: 3, name: "Express", path: "/assets/logos/express.svg" },
      { id: 4, name: "MongoDB", path: "/assets/logos/mongodb.svg" },
      { id: 5, name: "JWT", path: "/assets/logos/jwt.svg" },
      { id: 6, name: "Cloudinary", path: "/assets/logos/cloudinary.svg" },
    ],
  },

  {
    id: 4,
    title: "Zenith – AR Emergency Route Simulator",
    description:
      "Ambulance AR navigation system using a MERN backend, Google Maps API, WebSockets, and Firebase notifications.",
    href: "https://github.com/Chandi977/AR-Based-Emergency-Route-Simulator",
    image: "/assets/projects/zenith-ar.jpg",
    tags: [
      { id: 1, name: "MERN", path: "/assets/logos/mern.svg" },
      { id: 2, name: "WebSockets", path: "/assets/logos/websocket.svg" },
      { id: 3, name: "Firebase", path: "/assets/logos/firebase.svg" },
      { id: 4, name: "Google Maps API", path: "/assets/logos/googlemaps.svg" },
    ],
  },

  {
    id: 5,
    title: "Speakbot Command Following Bot",
    description:
      "A Python-based assistant bot that handles commands like weather, movies, Wikipedia, and location using various APIs.",
    href: "https://github.com/Chandi977/Speakbot-Command-Following-Bot",
    image: "/assets/projects/speakbot.png",
    tags: [
      { id: 1, name: "Python", path: "/assets/logos/python.svg" },
      { id: 2, name: "APIs", path: "/assets/logos/api.svg" },
    ],
  },

  {
    id: 6,
    title: "Banjara Tour & Travel",
    description:
      "A complete core PHP-based travel agency website with packages, contact forms, and booking features.",
    href: "https://github.com/Chandi977/Banjara-Tour-and-Travel",
    image: "/assets/projects/banjara.png",
    tags: [
      { id: 1, name: "PHP", path: "/assets/logos/php.svg" },
      { id: 2, name: "HTML", path: "/assets/logos/html5.svg" },
      { id: 3, name: "CSS", path: "/assets/logos/css3.svg" },
      { id: 4, name: "JavaScript", path: "/assets/logos/javascript.svg" },
    ],
  },

  {
    id: 7,
    title: "Netflix Clone",
    description:
      "A full-stack Netflix clone using React for the frontend and Firebase for authentication and database.",
    href: "https://github.com/Chandi977/Netflixclone",
    image: "/assets/projects/netflix.png",
    tags: [
      { id: 1, name: "React", path: "/assets/logos/react.svg" },
      { id: 2, name: "Firebase", path: "/assets/logos/firebase.svg" },
      { id: 3, name: "CSS", path: "/assets/logos/css3.svg" },
    ],
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

export const experiences = [
  {
    title: "Full Stack Developer",
    job: "Prem Packaging (Prem Industries India Ltd.)",
    date: "Dec 2025 - Present",
    contents: [
      "Developed and maintained production-grade web applications handling product catalogs, order management, and admin dashboards.",
      "Built scalable REST APIs using Node.js, Express, and MongoDB to support search, filtering, and role-based access control.",
      "Integrated AWS services including EC2, S3, CloudFront, and IAM for secure deployment and optimized content delivery.",
      "Implemented caching strategies using Redis to reduce API latency and improve application performance.",
      "Worked on frontend deployment via AWS Amplify and ensured smooth communication with backend services.",
      "Diagnosed and resolved production issues related to environment variables, IAM permissions, and database connectivity.",
    ],
  },

  {
    title: "Software Engineering Virtual Experience",
    job: "J.P. Morgan (via Forage)",
    date: "Jun 2025",
    contents: [
      "Completed real-world tasks such as data visualization, frontend enhancements, and bug fixes using JPMorgan’s simulated interface.",
      "Utilized Python, React, and TypeScript to build a stock price data feed interface and integrate performance enhancements.",
      "Analyzed financial data streams using JPMorgan's frameworks and tools for internal systems.",
      "Gained exposure to large-scale investment banking technology environments.",
    ],
  },

  {
    title: "Full Stack Developer",
    job: "Freelance & Personal Projects",
    date: "2023 - Present",
    contents: [
      "Built full-stack applications like Banjara Tour & Travel, Netflix Clone, and Speakbot Bot.",
      "Used MERN, PHP, and Firebase across different projects covering payment integration, user auth, and real-time features.",
      "Created RESTful APIs, integrated third-party services (Razorpay, Cloudinary, Auth APIs), and deployed projects on GitHub.",
      "Continuously practicing DSA (365+ LeetCode streak) to improve logic and system design for scalable apps.",
    ],
  },

  {
    title: "Web Development Intern",
    job: "Adityapur Auto Cluster (AAC), Jamshedpur",
    date: "Oct 2021 - Nov 2021",
    contents: [
      "Collaborated with the frontend team to design and implement responsive web interfaces using HTML5, CSS3, and Flexbox.",
      "Built static landing pages and forms as part of AAC's digital portal.",
      "Improved visual consistency across pages by modularizing styles and reusing UI components.",
      "Participated in daily code reviews and bug fixes, improving teamwork and problem-solving skills.",
    ],
  },
];
