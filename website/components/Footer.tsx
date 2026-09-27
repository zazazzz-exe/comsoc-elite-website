"use client";

import { motion } from "framer-motion";
import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";

const ease = [0.16, 1, 0.3, 1] as const;

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Faculty", href: "#faculty" },
  { label: "Officers", href: "#officers" },
  { label: "Events", href: "#events" },
  { label: "Membership", href: "#membership" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#0a0a0a] font-sans text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:px-12 lg:grid-cols-[1.4fr_0.75fr_1fr] lg:px-16"
      >
        <div className="flex max-w-sm flex-col gap-5">
          <div className="text-lg font-heading font-light uppercase tracking-[0.2em] text-white/90">
            PLP Computer Society
          </div>
          <p className="text-sm leading-relaxed text-white/55">
            A student-led space for learning, collaboration, and growth in the College of Computer Studies.
          </p>
          <a
            href="https://www.facebook.com/share/14pXvfiSecT/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 border border-white/15 px-4 py-3 text-[10px] font-heading font-bold uppercase tracking-[0.22em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            <IconBrandFacebook size={16} stroke={1.5} />
            Connect on Facebook
            <IconArrowUpRight size={14} stroke={1.5} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-5">
          <div className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/35">
            Navigation
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-white/55 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-5">
          <div className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-white/35">
            Contact
          </div>
          <div className="flex flex-col gap-4 text-sm text-white/55">
            <a href="mailto:valles_zarrahexekiel@plpasig.edu.ph" className="flex items-start gap-3 transition-colors hover:text-white">
              <IconMail size={16} stroke={1.5} className="mt-0.5 shrink-0" />
              <span>valles_zarrahexekiel@plpasig.edu.ph</span>
            </a>
            <a href="mailto:zarrahexekiel@gmail.com" className="flex items-start gap-3 transition-colors hover:text-white">
              <IconMail size={16} stroke={1.5} className="mt-0.5 shrink-0" />
              <span>zarrahexekiel@gmail.com</span>
            </a>
            <a href="tel:+639153868047" className="flex items-center gap-3 transition-colors hover:text-white">
              <IconPhone size={16} stroke={1.5} className="shrink-0" />
              <span>0915 386 8047</span>
            </a>
          </div>
        </div>
      </motion.div>

      <div className="border-t border-white/10 px-6 py-6 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-[10px] font-heading uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PLP Computer Society</span>
          <span>College of Computer Studies</span>
          <a
            href="https://www.facebook.com/share/14pXvfiSecT/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PLP Computer Society on Facebook"
            className="flex w-fit items-center gap-2 transition-colors hover:text-white"
          >
            <IconBrandFacebook size={15} stroke={1.5} />
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
