"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { upcomingEvents } from "@/lib/data/events";

const navItems = [
  { name: "Home", href: "#home", num: "01" },
  { name: "About", href: "#about", num: "02" },
  { name: "Faculty", href: "#faculty", num: "03" },
  { name: "Officers", href: "#officers", num: "04" },
  { name: "Events", href: "#events", num: "05" },
  { name: "Membership", href: "#membership", num: "06" },
  { name: "Contact", href: "#contact", num: "07" },
];

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="home" className="bg-[#121212] h-[100dvh] w-full relative overflow-hidden font-sans text-white flex flex-col">
      
      {/* Background image — fades in independently */}
      <div className="hero-bg absolute inset-0 z-0" />
      
      {/* Main Content Overlay */}
      <div className="relative z-10 flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-between pointer-events-none w-full min-h-0">
        
        {/* Top Header - Kept split for logo but main title moved to center */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-between items-start pointer-events-auto w-full"
        >
          {/* Top Left (empty or small branding) */}
          <div className="hidden md:flex items-center gap-2">
            <span className="font-heading font-light tracking-[0.2em] text-white/50 text-sm">PLP</span>
          </div>
          
          {/* Top Right Logo / Text */}
          <div className="hidden md:flex items-center gap-1">
            <Image
              src="/ccs-elite-logo.png"
              alt="CCS Elite Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="text-xs uppercase tracking-[0.3em] text-white/80 leading-snug font-heading font-bold text-left">
              ccs elite
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white pointer-events-auto ml-auto" onClick={() => setMenuOpen(!menuOpen)}>
             <Menu className="w-8 h-8" />
          </button>
        </motion.div>

        {/* Left Side Navigation (Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-col gap-6 absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 font-heading text-xs tracking-[0.3em] uppercase pointer-events-auto"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/20 mb-2 ml-2" />
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="group flex items-center gap-4 text-white/50 hover:text-white transition-all duration-500">
              <span className="text-[9px] font-light opacity-50 group-hover:opacity-100 transition-opacity">/{item.num}</span>
              <span className="relative overflow-hidden pb-1 whitespace-nowrap">
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </span>
            </a>
          ))}
          <div className="w-[1px] h-16 bg-gradient-to-t from-transparent to-white/20 mt-2 ml-2" />
        </motion.div>

        {/* Centered Middle Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center mt-auto mb-auto pointer-events-auto text-center py-4"
        >
          <div className="text-xl md:text-2xl font-light text-white/80 mb-2 md:mb-4 font-heading tracking-wider">
            \\ 01
          </div>
          
          {/* Main Title Area */}
          <h1 className="text-[clamp(2.2rem,6vw,7rem)] font-display font-light tracking-[0.15em] leading-[1.1] uppercase text-white mb-2">
             COMPUTER<br />SOCIETY
          </h1>
          <a
            href="https://www.facebook.com/PLPCOMSOC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-lg lg:text-xl font-heading font-light tracking-[0.2em] text-white/70 mb-4 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-heading font-medium">@</span> college_of_computer_studies
          </a>

          <div className="text-3xl md:text-4xl text-white mb-4 leading-none tracking-widest font-heading">
            ✦ ✦ ✦
          </div>
          <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans max-w-[300px] md:max-w-lg text-center mx-auto">
            An organization for the students, by the students, built as a space for learning, collaboration, and growth.
          </p>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center items-end pointer-events-auto w-full relative min-h-[90px]"
        >
          {/* Scroll Down Indicator */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-heading text-[10px] tracking-[0.4em] text-white/40 uppercase">Scroll</span>
            <div className="w-[1px] h-6 bg-white/10 relative overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-white/60 absolute top-0 left-0"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          {/* Bottom Right Barcode (Absolute positioned to keep it on the right) */}
          <div className="hidden md:flex flex-col items-center gap-2 absolute right-0 bottom-0">
            <div className="flex h-12 md:h-14 items-end gap-[2px] md:gap-[3px] opacity-100">
              {[3, 1, 4, 2, 1, 5, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1, 2, 5, 1, 3, 2, 4, 2, 1, 3].map((w, i) => (
                <div key={i} className="bg-white h-full" style={{ width: `${w * 2}px` }} />
              ))}
            </div>
            <div className="flex justify-between w-full text-[10px] md:text-xs tracking-[0.4em] font-heading uppercase font-bold px-1">
              <span>COM</span>
              <span>SOC</span>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Mobile nav overlay */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#121212]/95 backdrop-blur-xl pointer-events-auto"
        >
          <button className="absolute top-8 right-8 text-white" onClick={() => setMenuOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-2xl font-display font-light uppercase tracking-[0.2em] text-white transition-colors hover:text-white/50 sm:text-3xl"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </motion.div>
      )}

      {/* Horizon Glow */}
      <div className="horizon-glow" aria-hidden="true" />

      {/* Latest Event Marquee */}
      {upcomingEvents.length > 0 && (
        <div className="relative w-full z-20 border-t border-white/10 bg-[#121212]/80 backdrop-blur-md overflow-hidden flex items-center py-2 md:py-3 pointer-events-auto group mt-auto">
          <a href="#events" className="flex whitespace-nowrap items-center text-xs md:text-sm font-heading tracking-[0.2em] uppercase text-white/70 group-hover:text-white transition-colors w-max hover:cursor-pointer">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 25, repeat: Infinity }}
              className="flex items-center"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mx-6 md:mx-8 animate-pulse" />
                  <span className="font-bold mr-3 text-white">LATEST EVENT:</span>
                  <span>{upcomingEvents[0].title}</span>
                  <span className="mx-3">—</span>
                  <span>{upcomingEvents[0].date} @ {upcomingEvents[0].location}</span>
                </div>
              ))}
            </motion.div>
          </a>
        </div>
      )}

    </div>
  );
}
