import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

// Memoized Navigation component
const Navigation = memo(function Navigation({ onClick }) {
  const navItems = useMemo(
    () => ["home", "about", "work", "freelance", "contact"],
    [],
  );

  return (
    <ul className="nav-ul">
      {navItems.map((item) => (
        <li key={item} className="nav-li">
          <a href={`#${item}`} onClick={onClick} className="nav-link">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        </li>
      ))}
    </ul>
  );
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized toggle handler
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Memoized close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Memoized header class
  const headerClass = useMemo(
    () =>
      `fixed inset-x-0 top-0 z-30 transition-all duration-300 ${scrolled ? "bg-primary/70 backdrop-blur-xl shadow-lg" : "bg-transparent"}`,
    [scrolled],
  );

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={headerClass}
      style={{ willChange: "transform, opacity" }}
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
            onClick={handleToggle}
            className="sm:hidden text-neutral-400 hover:text-white transition"
            aria-label="Toggle Menu"
          >
            <img
              src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
              className="w-6 h-6"
              alt="menu"
              loading="lazy"
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
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden sm:hidden bg-primary/80 backdrop-blur-xl"
            style={{ willChange: "height, opacity" }}
          >
            <div className="pb-6 pt-2">
              <Navigation onClick={handleClose} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default memo(Navbar);
