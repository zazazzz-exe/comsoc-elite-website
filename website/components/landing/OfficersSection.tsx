"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRightLeft } from "lucide-react";
import { IconBrandFacebook, IconMail } from "@tabler/icons-react";
import type { Adviser, Officer, Team } from "@/lib/data/officers";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.8, ease },
};

/* ────────────────────────────────────────────────────────────
   CardFace — one side of the flip card (portrait + text)
   ──────────────────────────────────────────────────────────── */
function CardFace({ officer }: { officer: Officer }) {
  return (
    <div
      className="flex h-[280px] w-full flex-col border border-white/10 bg-white/[0.02] sm:h-[330px] md:h-[400px]"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Portrait */}
      <div className="relative min-h-0 w-full flex-1 overflow-hidden border-b border-white/10 bg-[#0c0c0e]">
        {officer.image ? (
          <Image
            src={officer.image}
            alt={officer.name}
            fill
            className="object-cover contrast-125"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
      <div className="flex h-28 shrink-0 flex-col gap-1.5 px-3 py-3 text-center sm:h-36 sm:gap-2 sm:px-4 sm:py-4 md:h-40 md:px-6 md:py-5">
        <div className="flex min-h-7 items-center justify-center text-[8px] font-heading font-bold uppercase leading-tight tracking-[0.2em] text-white/50 sm:min-h-9 sm:text-[9px] sm:tracking-[0.25em] md:text-[10px] md:tracking-[0.3em]">
          {officer.role}
        </div>
        <div className="flex min-h-6 items-center justify-center text-xs font-display uppercase leading-tight tracking-[0.08em] text-white sm:min-h-8 sm:text-sm md:text-base">
          {officer.name}
        </div>
        {(officer.email || officer.facebook) && (
          <div className="relative z-10 flex h-8 justify-center gap-2 pt-1 sm:h-7">
            {officer.email && (
              <a
                href={`mailto:${officer.email}`}
                aria-label={`Email ${officer.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white sm:h-7 sm:w-7 [transform:translateZ(1px)]"
              >
                <IconMail size={14} stroke={1.5} />
              </a>
            )}
            {officer.facebook && (
              <a
                href={officer.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${officer.name}'s Facebook profile`}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white sm:h-7 sm:w-7 [transform:translateZ(1px)]"
              >
                <IconBrandFacebook size={14} stroke={1.5} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   FlippableCard — 3D flip card with front + back faces + tilt
   ──────────────────────────────────────────────────────────── */
function FlippableCard({
  front,
  back,
  flipped,
  delay = 0,
}: {
  front: Officer;
  back: Officer;
  flipped: boolean;
  delay?: number;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tiltRef.current) return;
      const rect = tiltRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        rotateX: (0.5 - y) * 12,
        rotateY: (x - 0.5) * 12,
        scale: 1.03,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.8, delay, ease }}
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
        }}
      >
        <div style={{ perspective: 1000 }}>
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, delay: delay * 0.5, ease }}
            className="relative w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front face (COMSOC) */}
            <motion.div
              animate={{ opacity: flipped ? 0 : 1 }}
              transition={{ duration: 0.3, delay: delay * 0.5 }}
            >
              <CardFace officer={front} />
            </motion.div>

            {/* Back face (CCS ELITES) */}
            <motion.div
              animate={{ opacity: flipped ? 1 : 0 }}
              transition={{ duration: 0.3, delay: delay * 0.5 }}
              className="absolute inset-0 w-full h-full"
              style={{ transform: "rotateY(180deg)" }}
            >
              <CardFace officer={back} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   TierConnector — vertical line between tiers
   ──────────────────────────────────────────────────────────── */
function TierConnector() {
  return (
    <div className="flex flex-col items-center my-3 sm:my-4 md:my-6">
      <div className="w-px h-5 bg-white/15 sm:h-6 md:h-10" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   OrgPyramid — renders the flippable pyramid for both orgs
   Responsive: single-col mobile, pyramid desktop
   ──────────────────────────────────────────────────────────── */
function OrgPyramid({ flipped, comsocTeam, elitesTeam }: { flipped: boolean; comsocTeam: Team; elitesTeam: Team }) {
  const comsocTiers = comsocTeam.tiers;
  const elitesTiers = elitesTeam.tiers;

  return (
    <motion.div {...fadeUp} className="flex flex-col items-center w-full">
      {/* Org label */}
      <div className="w-full flex items-center gap-4 mb-8 sm:gap-6 sm:mb-10 md:mb-14">
        <div className="h-px flex-1 bg-white/10" />
        <AnimatePresence mode="wait">
          <motion.h3
            key={flipped ? "elites" : "comsoc"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="text-[10px] sm:text-xs md:text-sm font-heading font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 whitespace-nowrap"
          >
            {flipped ? elitesTeam.name : comsocTeam.name}
          </motion.h3>
        </AnimatePresence>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* ── Mobile: 2-col grid ── */}
      <div className="flex flex-col items-center w-full sm:hidden">
        {/* President — full width centered */}
        <div className="w-full max-w-[200px]">
          <FlippableCard
            front={comsocTiers[0][0]}
            back={elitesTiers[0][0]}
            flipped={flipped}
            delay={0}
          />
        </div>

        <TierConnector />

        {/* VPs — 2-col */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {comsocTiers[1].map((comsocOfficer, i) => (
            <div key={comsocOfficer.name} className="w-full">
              <FlippableCard
                front={comsocOfficer}
                back={elitesTiers[1][i]}
                flipped={flipped}
                delay={(1 + i) * 0.05}
              />
            </div>
          ))}
        </div>

        <TierConnector />

        {/* Bottom tier — 2-col grid on mobile */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {comsocTiers[2].map((comsocOfficer, i) => (
            <div
              key={comsocOfficer.name}
              className={i === comsocTiers[2].length - 1 && comsocTiers[2].length % 2 !== 0 ? "col-span-2 flex justify-center" : "w-full"}
            >
              <div className={i === comsocTiers[2].length - 1 && comsocTiers[2].length % 2 !== 0 ? "w-[140px]" : "w-full"}>
                <FlippableCard
                  front={comsocOfficer}
                  back={elitesTiers[2][i]}
                  flipped={flipped}
                  delay={(3 + i) * 0.05}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tablet (sm/md): tighter centered grid ── */}
      <div className="hidden sm:flex md:hidden flex-col items-center w-full">
        {/* President — centered */}
        <div className="w-full max-w-[200px]">
          <FlippableCard
            front={comsocTiers[0][0]}
            back={elitesTiers[0][0]}
            flipped={flipped}
            delay={0}
          />
        </div>

        <TierConnector />

        {/* VPs — 2-col */}
        <div className="flex justify-center gap-4 w-full">
          {comsocTiers[1].map((comsocOfficer, i) => (
            <div key={comsocOfficer.name} className="w-[160px] shrink-0">
              <FlippableCard
                front={comsocOfficer}
                back={elitesTiers[1][i]}
                flipped={flipped}
                delay={(1 + i) * 0.05}
              />
            </div>
          ))}
        </div>

        <TierConnector />

        {/* Bottom tier — 3+2 or wrap */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
          {comsocTiers[2].map((comsocOfficer, i) => (
            <div key={comsocOfficer.name} className="w-[140px] shrink-0">
              <FlippableCard
                front={comsocOfficer}
                back={elitesTiers[2][i]}
                flipped={flipped}
                delay={(3 + i) * 0.05}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop (md+): full pyramid ── */}
      <div className="hidden md:flex flex-col items-center w-full">
        {comsocTiers.map((comsocTier, tierIndex) => {
          const elitesTier = elitesTiers[tierIndex];
          const globalOffset = comsocTiers
            .slice(0, tierIndex)
            .reduce((sum, t) => sum + t.length, 0);

          return (
            <div key={tierIndex}>
              {tierIndex > 0 && <TierConnector />}
              <div className="flex justify-center gap-5 lg:gap-6">
                {comsocTier.map((comsocOfficer, i) => (
                  <div
                    key={comsocOfficer.name}
                    className="w-[170px] lg:w-[200px] shrink-0"
                  >
                    <FlippableCard
                      front={comsocOfficer}
                      back={elitesTier[i]}
                      flipped={flipped}
                      delay={(globalOffset + i) * 0.05}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────────── */
export default function OfficersSection({ comsocTeam, elitesTeam, comsocAdviser, elitesAdviser }: { comsocTeam: Team; elitesTeam: Team; comsocAdviser: Adviser; elitesAdviser: Adviser }) {
  const [flipped, setFlipped] = useState(false);
  const adviser = flipped ? elitesAdviser : comsocAdviser;

  return (
    <section
      id="officers"
      className="bg-[#121212] w-full relative overflow-hidden font-sans text-white py-20 sm:py-24 md:py-32 px-5 sm:px-6 md:px-12 lg:px-16 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14 sm:gap-16 md:gap-20 lg:gap-28 relative z-10">
        {/* Section Header */}
        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-8"
        >
          <div>
            <div className="text-lg sm:text-xl md:text-2xl font-light text-white/50 mb-3 sm:mb-4 font-heading tracking-wider">
              \\ 04
            </div>
            <h2 className="text-[clamp(2rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Officers <br className="hidden sm:block" /> &amp; Teams
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            The student leaders driving learning, collaboration, growth, and
            meaningful initiatives within PLP COMSOC.
          </p>
        </motion.div>

        {/* ── Toggle Button ── */}
        <motion.div {...fadeUp} className="flex justify-center">
          <button
            onClick={() => setFlipped((f) => !f)}
            className="group flex items-center gap-3 border border-white/15 hover:border-white/30 bg-white/[0.02] hover:bg-white/[0.05] rounded-full px-5 py-3 sm:px-6 transition-all duration-500 min-h-[44px]"
          >
            <ArrowRightLeft className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-500" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-heading font-bold text-white/60 group-hover:text-white/90 transition-colors duration-500">
              {flipped ? "View COMSOC" : "View ELITES"}
            </span>
          </button>
        </motion.div>

        {/* ── Pyramid (flippable) ── */}
        <OrgPyramid flipped={flipped} comsocTeam={comsocTeam} elitesTeam={elitesTeam} />

        {/* ── Faculty Adviser + Contact ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 md:gap-16 lg:gap-24 pt-14 sm:pt-16 md:pt-20 border-t border-white/10">

          {/* Faculty Adviser */}
          <div className="flex flex-col gap-8 sm:gap-10">
            <h3 className="text-[10px] sm:text-xs md:text-sm font-heading font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50">
              Faculty Adviser
            </h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? "elites-adviser" : "comsoc-adviser"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease }}
                className="flex flex-col items-start gap-6 sm:gap-8 sm:flex-row"
              >
                <div className="relative h-36 w-28 shrink-0 overflow-hidden border border-white/10 bg-[#0c0c0e] sm:h-40 sm:w-32">
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
                        <line
                          x1="0"
                          y1="250"
                          x2="200"
                          y2="250"
                          strokeWidth="4"
                        />
                      </g>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <div className="text-2xl sm:text-3xl font-display uppercase tracking-[0.08em] sm:tracking-[0.1em] text-white md:text-4xl">
                    {adviser.name}
                  </div>
                  <div className="text-sm sm:text-base font-sans text-white/60">
                    {adviser.department}
                  </div>
                  {adviser.email && adviser.facebook && (
                    <div className="flex gap-2 pt-1">
                      <a
                        href={`mailto:${adviser.email}`}
                        aria-label={`Email ${adviser.name}`}
                        className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white"
                      >
                        <IconMail size={16} stroke={1.5} />
                      </a>
                      <a
                        href={adviser.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${adviser.name}'s Facebook profile`}
                        className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center border border-white/15 text-white/50 transition-colors hover:border-white/50 hover:text-white"
                      >
                        <IconBrandFacebook size={16} stroke={1.5} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-8 sm:gap-10">
            <h3 className="text-[10px] sm:text-xs md:text-sm font-heading font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50">
              Contact &amp; HQ
            </h3>
            <div className="flex flex-col w-full">
              {[
                { label: "Email", value: "ccsliteswashere", icon: "✉" },
                {
                  label: "Office",
                  value: "CCS Building, Room 402",
                  icon: "📍",
                },
                { label: "Social", value: "@ccs_elite_org", icon: "❖" },
              ].map((info, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-5 sm:py-6 border-b border-white/10 group cursor-default min-h-[48px]"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-white/30 text-lg sm:text-xl group-hover:text-emerald-400 transition-colors duration-300">
                      {info.icon}
                    </span>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/50 font-heading">
                      {info.label}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base md:text-lg font-sans text-white/90 text-right">
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
