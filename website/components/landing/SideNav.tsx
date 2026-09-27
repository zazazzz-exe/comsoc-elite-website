"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "01", name: "HOME", href: "#home" },
  { id: "02", name: "ABOUT", href: "#about" },
  { id: "03", name: "FACULTY", href: "#faculty" },
  { id: "04", name: "OFFICERS", href: "#officers" },
  { id: "05", name: "EVENTS", href: "#events" },
  { id: "06", name: "MEMBERSHIP", href: "#membership" },
  { id: "07", name: "CONTACT", href: "#contact" },
];

export default function SideNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 300);
          
          // Super basic scroll spy
          let current = "";
          for (const item of navItems) {
            const section = item.href.substring(1);
            const element = document.getElementById(section);
            if (element && scrollY >= (element.offsetTop - 300)) {
              current = section;
            }
          }
          setActiveSection(current);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 md:bottom-auto top-auto md:top-1/2 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 md:right-10 translate-y-0 md:-translate-y-1/2 z-50 flex flex-row md:flex-col gap-2 md:gap-6 pointer-events-none"
        >
          {navItems.map((item) => {
            const section = item.href.substring(1);
            const isActive = activeSection === section;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveSection(section)}
                aria-current={isActive ? "location" : undefined}
                className="group pointer-events-auto flex items-center justify-end gap-4"
              >
                {/* Text that slides in on hover (Desktop only) */}
                <div className="hidden md:flex flex-col items-end opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-[9px] font-heading tracking-[0.4em] text-white/40 uppercase">sec // {item.id}</span>
                  <span className="text-xs font-heading tracking-[0.2em] font-medium text-white">{item.name}</span>
                </div>
                
                {/* The Box */}
                <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border transition-all duration-300 backdrop-blur-md ${
                  isActive 
                    ? "bg-white border-white text-[#121212]" 
                    : "bg-[#121212]/50 border-white/20 text-white/70 group-hover:bg-white group-hover:border-white group-hover:text-[#121212]"
                }`}>
                  <span className="font-heading text-[9px] md:text-[10px] tracking-widest font-bold">
                    {item.id}
                  </span>
                </div>
              </a>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
