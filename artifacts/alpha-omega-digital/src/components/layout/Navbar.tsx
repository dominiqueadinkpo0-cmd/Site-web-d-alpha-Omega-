import { Link, useLocation } from "wouter";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#services", label: "Services" },
    { href: "/#processus", label: "Processus" },
    { href: "/#portfolio", label: "Portfolio" },
    { href: "/#technologies", label: "Technologies" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex flex-col items-center leading-tight group">
          <svg width="180" height="36" viewBox="0 0 180 36" xmlns="http://www.w3.org/2000/svg" className="group-hover:opacity-80 transition-opacity">
            <text x="0" y="20" fontFamily="Montserrat, sans-serif" fontWeight="300" fontSize="16" letterSpacing="8" fill="currentColor" textAnchor="start">ALPHA OMÉGA</text>
            <text x="28" y="34" fontFamily="Montserrat, sans-serif" fontWeight="300" fontSize="9" letterSpacing="12" fill="currentColor" textAnchor="start">DIGITAL</text>
          </svg>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-secondary-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Link href="/questionnaire">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-full px-6 py-5 h-auto transition-transform hover:scale-105">
              Discuter de mon projet <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-border p-6 shadow-xl md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link href="/questionnaire" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-lg">
                Discuter de mon projet <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
