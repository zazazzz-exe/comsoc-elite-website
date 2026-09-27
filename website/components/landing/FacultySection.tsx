"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Faculty } from "@/lib/data/faculty";

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.8, ease },
};

/* ────────────────────────────────────────────────────────────
   FacultyCard — static card (portrait + text) with 3D tilt
   ──────────────────────────────────────────────────────────── */
function FacultyCard({
  faculty,
  delay = 0,
}: {
  faculty: Faculty;
  delay?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
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
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.8, delay, ease }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex h-[330px] w-full flex-col border border-white/10 bg-white/[0.02] transition-transform duration-200 ease-out will-change-transform md:h-[400px]"
        style={{
          transform: `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Portrait */}
        <div className="relative min-h-0 w-full flex-1 overflow-hidden border-b border-white/10 bg-[#0c0c0e]">
          {faculty.image ? (
            <Image
              src={faculty.image}
              alt={faculty.name}
              fill
              className="object-cover contrast-125 transition-transform duration-500"
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
        <div className="flex h-28 shrink-0 flex-col justify-center gap-2 px-4 py-4 text-center md:h-32 md:px-6 md:py-5">
          <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 font-heading font-bold md:text-[10px] md:tracking-[0.3em]">
            {faculty.department}
          </div>
          <div className="flex min-h-8 items-center justify-center text-base font-display uppercase leading-tight tracking-[0.1em] text-white md:text-lg">
            {faculty.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Section
   ──────────────────────────────────────────────────────────── */
export default function FacultySection({ faculty }: { faculty: Faculty[] }) {
  return (
    <section
      id="faculty"
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
              \\ 03
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Faculty
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            The esteemed professors and advisers guiding our organization and supporting academic excellence.
          </p>
        </motion.div>

        {/* Faculty Grid */}
        <motion.div
          {...fadeUp}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {faculty.map((faculty, i) => (
            <FacultyCard key={faculty.name} faculty={faculty} delay={i * 0.05} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
