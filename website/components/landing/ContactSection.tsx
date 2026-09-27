"use client";

import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { facultyAdviser } from "@/lib/data/officers";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#121212] w-full relative overflow-hidden font-sans text-white pt-24 pb-36 md:py-24 px-6 md:px-12 lg:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <div className="text-xl md:text-2xl font-light text-white/80 mb-4 font-heading tracking-wider">
              \\ 07
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Contact &<br />Connect
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            Reach out for inquiries, partnerships, or support. Stay connected through our official channels.
          </p>
        </motion.div>

        {/* Contact Info Rows */}
        <div className="flex flex-col border-t border-white/10">
          
          {/* Email Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-14 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 group"
          >
            <div className="text-sm font-sans text-white/40 uppercase tracking-[0.2em] mb-4 md:mb-0 w-48 lg:w-64 shrink-0 flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              Official Email
            </div>
            <a href="mailto:valles_zarrahexekiel@plpasig.edu.ph" className="text-[clamp(1rem,5vw,2.25rem)] md:text-4xl lg:text-5xl font-display uppercase tracking-wider text-white group-hover:text-white/90 transition-colors break-all">
              valles_zarrahexekiel@plpasig.edu.ph
            </a>
            <div className="hidden md:flex justify-end w-24 lg:w-32">
               <Mail className="w-6 h-6 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
          </motion.div>

          {/* Social Media Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-14 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 group"
          >
            <div className="text-sm font-sans text-white/40 uppercase tracking-[0.2em] mb-6 md:mb-0 w-48 lg:w-64 shrink-0 flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
              Social Media
            </div>
            <div className="flex gap-4 md:gap-8 flex-col sm:flex-row sm:items-center">
              <a href="https://www.facebook.com/PLPCOMSOC" target="_blank" rel="noopener noreferrer" className="text-xl md:text-3xl font-display uppercase tracking-wider text-white/70 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-white after:origin-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-500">
                Facebook
              </a>
              <span className="text-white/20 text-xl md:text-3xl hidden sm:inline-block">/</span>
              <span aria-disabled="true" className="text-xl md:text-3xl font-display uppercase tracking-wider text-white/30 cursor-not-allowed">
                Twitter
              </span>
              <span className="text-white/20 text-xl md:text-3xl hidden sm:inline-block">/</span>
              <span aria-disabled="true" className="text-xl md:text-3xl font-display uppercase tracking-wider text-white/30 cursor-not-allowed">
                Instagram
              </span>
            </div>
            <div className="hidden md:block w-24 lg:w-32" />
          </motion.div>

          {/* Adviser Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-14 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 group"
          >
            <div className="text-sm font-sans text-white/40 uppercase tracking-[0.2em] mb-4 md:mb-0 w-48 lg:w-64 shrink-0 flex items-center gap-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
              Faculty Adviser
            </div>
            <div className="flex flex-col items-start md:flex-row md:items-baseline gap-2 md:gap-6">
              <span className="text-2xl md:text-4xl lg:text-5xl font-display uppercase tracking-wider text-white group-hover:text-white/90 transition-colors">
                {facultyAdviser.name}
              </span>
              <span className="text-sm md:text-base font-sans text-white/40 tracking-[0.1em] uppercase">
                College of Computer Studies
              </span>
            </div>
            <div className="hidden md:flex justify-end w-24 lg:w-32">
               <User className="w-6 h-6 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
