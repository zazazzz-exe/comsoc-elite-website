"use client";

import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRightLeft } from "lucide-react";
import { IconBrandFacebook, IconMail } from "@tabler/icons-react";
import {
  comsocOfficers,
  ccsElites,
  facultyAdviser,
  ccsElitesAdviser,
  orgContact,
} from "@/lib/data/officers";
import type { Officer } from "@/lib/data/officers";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.8, ease },
};

/* ────────────────────────────────────────────────────────────
   CardFace — officer portrait + text
   ──────────────────────────────────────────────────────────── */
function CardFace({ officer }: { officer: Officer }) {
  return (
    <div
      className="flex h-[330px] w-full flex-col border border-white/10 bg-white/[0.02] md:h-[400px]"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Portrait */}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden border-b border-white/10 bg-[#0c0c0e]">
        {officer.image ? (
          <Image
            src={officer.image}
            alt={officer.name}
            fill
            className={officer.image === "/ccs-elite-logo.png" ? "object-contain p-8" : "object-cover contrast-125"}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <svg
            viewBox="0 0 200 250"
            className="absolute inset-0 w-full h-full text-white/[0.06]"
            aria-hidden="true"
          >
            <g stroke="currentColor" strokeWidth="1" fill="none">
              <circle cx="100" cy="78" r="34" />
              <path d="M40 250c6-46 32-70 60-70s54 24 60 70" />
              <line x1="0" y1="250" x2="200" y2="250" strokeWidth="4" />
            </g>
          </svg>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 via-transparent to-transparent pointer-events-none" />
      </div>
      {/* Text */}
      <div className={`flex h-36 shrink-0 flex-col gap-2 px-4 py-4 text-center md:h-40 md:px-6 md:py-5 ${officer.role ? "" : "justify-center"}`}>
        {officer.role && (
          <div className="flex min-h-9 items-center justify-center text-[9px] font-heading font-bold uppercase leading-tight tracking-[0.25em] text-white/50 md:text-[10px] md:tracking-[0.3em]">
            {officer.role}
          </div>
        )}
        <div className="flex min-h-8 items-center justify-center text-sm font-display uppercase leading-tight tracking-[0.1em] text-white md:text-base">
          {officer.name}
        </div>
        {(officer.email || officer.facebook) && (
          <div className="relative z-10 flex h-7 justify-center gap-2 pt-1">
            {officer.email && (
              <a
                href={`mailto:${officer.email}`}
                aria-label={`Email ${officer.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white [transform:translateZ(1px)]"
              >
                <IconMail size={15} stroke={1.5} />
              </a>
            )}
            {officer.facebook && (
              <a
                href={officer.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${officer.name}'s Facebook profile`}
                className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white [transform:translateZ(1px)]"
              >
                <IconBrandFacebook size={15} stroke={1.5} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HoverTiltCard({ children }: { children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilt({
      rotateX: (0.5 - y) * 12,
      rotateY: (x - 0.5) * 12,
      scale: 1.03,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
      style={{
        transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
      }}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   TierConnector — vertical line between tiers
   ──────────────────────────────────────────────────────────── */
function TierConnector() {
  return (
    <div className="flex flex-col items-center my-4 md:my-6">
      <div className="w-px h-6 md:h-10 bg-white/15" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   OrgPyramid — renders the officer tiers for both orgs
   ──────────────────────────────────────────────────────────── */
function OrgPyramid({ flipped }: { flipped: boolean }) {
  const tiers = flipped ? ccsElites.tiers : comsocOfficers.tiers;

  return (
    <motion.div {...fadeUp} className="flex flex-col items-center w-full">
      {/* Org label */}
      <div className="w-full flex items-center gap-6 mb-10 md:mb-14">
        <div className="h-px flex-1 bg-white/10" />
        <AnimatePresence mode="wait">
          <motion.h3
            key={flipped ? "elites" : "comsoc"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="text-xs md:text-sm font-heading font-bold tracking-[0.3em] uppercase text-white/50 whitespace-nowrap"
          >
            {flipped ? ccsElites.name : comsocOfficers.name}
          </motion.h3>
        </AnimatePresence>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="w-full">
        <div className="flex w-full flex-col items-center">
          {tiers.map((tier, tierIndex) => {
           const globalOffset = tiers
             .slice(0, tierIndex)
             .reduce((sum, t) => sum + t.length, 0);

          return (
            <div key={tierIndex}>
              {tierIndex > 0 && <TierConnector />}
                <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap md:gap-6">
                {tier.map((officer, i) => (
                  <motion.div
                    key={officer.name}
                    {...(flipped
                      ? { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }
                      : fadeUp)}
                    transition={{ duration: 0.8, delay: (globalOffset + i) * 0.05, ease }}
                    className={flipped ? "w-[140px] shrink-0 md:w-auto md:flex-1 md:shrink" : "w-[140px] shrink-0 md:w-[200px]"}
                  >
                    <HoverTiltCard>
                      <CardFace officer={officer} />
                    </HoverTiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────────── */
export default function OfficersSection() {
  const [flipped, setFlipped] = useState(false);
  const adviser = flipped ? ccsElitesAdviser : facultyAdviser;
  const contactInfo = flipped
    ? [
        { label: "Email", value: "ccsliteswashere", icon: "✉" },
        { label: "Office", value: orgContact.office, icon: "📍" },
        { label: "Social", value: "@ccs_elite_org", icon: "❖" },
      ]
    : [
        { label: "Email", value: orgContact.email, href: `mailto:${orgContact.email}`, icon: "✉" },
        { label: "Office", value: orgContact.office, icon: "📍" },
        { label: "Social", value: orgContact.handle, href: orgContact.url, icon: "❖" },
      ];

  return (
    <section
      id="officers"
      className="bg-[#121212] w-full relative overflow-hidden font-sans text-white py-32 px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-20 md:gap-28 relative z-10">
        {/* Section Header */}
        <motion.div
          {...fadeUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <div className="text-xl md:text-2xl font-light text-white/50 mb-4 font-heading tracking-wider">
              \\ 04
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Officers <br /> &amp; Teams
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            The student leaders driving learning, collaboration, growth, and meaningful initiatives within PLP COMSOC.
          </p>
        </motion.div>

        {/* ── Toggle Button ── */}
        <motion.div {...fadeUp} className="flex justify-center">
          <button
            onClick={() => setFlipped((f) => !f)}
            className="group flex items-center gap-3 border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-6 py-3 transition-all duration-500"
          >
            <ArrowRightLeft className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-500" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-heading font-bold text-white/60 group-hover:text-white/90 transition-colors duration-500">
              {flipped ? "View COMSOC" : "View ELITES"}
            </span>
          </button>
        </motion.div>

        {/* ── Pyramid (flippable) ── */}
        <OrgPyramid flipped={flipped} />

        {/* ── Faculty Adviser + Contact ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 pt-20 border-t border-white/10">

          {/* Faculty Adviser */}
          <div className="flex flex-col gap-10">
            <h3 className="text-sm font-heading font-bold tracking-[0.3em] uppercase text-white/50">
              {adviser.role}
            </h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "elites-adviser" : "comsoc-adviser"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease }}
                className="flex flex-col items-start gap-8 sm:flex-row"
              >
                <div className="relative h-40 w-32 shrink-0 overflow-hidden border border-white/10 bg-[#0c0c0e]">
                  {adviser.image ? (
                    <Image
                      src={adviser.image}
                      alt={adviser.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 200 250"
                      className="absolute inset-0 h-full w-full text-white/[0.06]"
                      aria-hidden="true"
                    >
                      <g stroke="currentColor" strokeWidth="1" fill="none">
                        <circle cx="100" cy="78" r="34" />
                        <path d="M40 250c6-46 32-70 60-70s54 24 60 70" />
                        <line x1="0" y1="250" x2="200" y2="250" strokeWidth="4" />
                      </g>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-4 pt-2">
                  <div className="text-3xl font-display uppercase tracking-[0.1em] text-white md:text-4xl">
                    {adviser.name}
                  </div>
                  <div className="text-base font-sans text-white/60">
                    {adviser.department}
                  </div>
                  {(adviser.email || adviser.facebook) && (
                    <div className="flex gap-2 pt-1">
                      {adviser.email && (
                        <a
                          href={`mailto:${adviser.email}`}
                          aria-label={`Email ${adviser.name}`}
                          className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white"
                        >
                          <IconMail size={16} stroke={1.5} />
                        </a>
                      )}
                      {adviser.facebook && (
                        <a
                          href={adviser.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${adviser.name}'s Facebook profile`}
                          className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white"
                        >
                          <IconBrandFacebook size={16} stroke={1.5} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-10">
            <h3 className="text-sm font-heading font-bold tracking-[0.3em] uppercase text-white/50">
              Contact & HQ
            </h3>
            <div className="flex flex-col w-full">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex justify-between items-center py-6 border-b border-white/10 group cursor-default">
                  <div className="flex items-center gap-6">
                    <span className="text-white/30 text-xl group-hover:text-emerald-400 transition-colors duration-300">
                      {info.icon}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-heading">
                      {info.label}
                    </span>
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      target={info.label === "Social" ? "_blank" : undefined}
                      rel={info.label === "Social" ? "noopener noreferrer" : undefined}
                      className="text-base font-sans text-white/90 transition-colors hover:text-emerald-400 md:text-lg"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-base md:text-lg font-sans text-white/90">
                      {info.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
