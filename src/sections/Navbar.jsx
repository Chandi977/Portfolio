import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function Navigation({ onClick }) {
  return (
    <ul className="nav-ul">
      {["home", "about", "work", "contact"].map((item) => (
        <li key={item} className="nav-li">
          <a href={`#${item}`} onClick={onClick} className="nav-link">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        </li>
      ))}
    </ul>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-30 transition-all duration-300
        ${
          scrolled
            ? "bg-primary/70 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto c-space max-w-7xl">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <a
            href="#home"
            className="text-xl font-bold tracking-wide text-neutral-300 hover:text-white transition-colors"
          >
            Charan
          </a>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex">
            <Navigation />
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-neutral-400 hover:text-white transition"
            aria-label="Toggle Menu"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6"
              alt="menu"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden sm:hidden bg-primary/80 backdrop-blur-xl"
          >
            <div className="pb-6 pt-2">
              <Navigation onClick={() => setIsOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
