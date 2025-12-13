/* eslint-disable no-undef */
import React, { useEffect } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experiences from "./sections/Experiences";
import Testimonial from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

const HEARTBEAT_URL = "https://charan-portfolio-htvx.onrender.com"; // Replace with your backend/server URL

const App = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(HEARTBEAT_URL)
        .then(() => {
          // Heartbeat sent
          console.log(`Heartbeat sent: ${res.statusCode}`);
        })
        .catch(() => {
          // Ignore errors
          console.error(`Heartbeat error: ${e.message}`);
        });
    }, 1000 * 30); // Every 14 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto max-w-7xl">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experiences />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
