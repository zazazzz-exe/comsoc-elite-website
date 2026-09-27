"use client";

import { motion } from "framer-motion";

export default function MembershipSection() {
  return (
    <section id="membership" className="bg-[#121212] w-full relative font-sans text-white py-24 px-6 md:px-12 lg:px-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-24 relative z-10">

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
              \\ 06
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Membership
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            Build skills, connections, leadership experience, and a stronger foundation for your future career in technology.
          </p>
        </motion.div>

        {/* Membership Details */}
        <div className="grid grid-cols-1 items-stretch gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Membership Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full flex-col gap-12 border border-white/10 bg-white/[0.02] p-8 md:p-12"
          >
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                About Membership
              </h3>
              <p className="text-white/60 leading-relaxed font-sans">
                The PLP Computer Society has consistently fostered technological competence, leadership, and community engagement among students of the College of Computer Studies.
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                Member Experience
              </h3>
              <ul className="flex flex-col gap-3 text-white/60 font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Leadership experience:</strong> gain experience in organizing events, teamwork, communication, and student leadership.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Participation in activities:</strong> join student organization events and activities related to your course and interests.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Access to opportunities and announcements:</strong> stay informed about CCS-related activities, projects, and opportunities.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Member Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex h-full flex-col gap-12 border border-white/10 bg-white/[0.02] p-8 md:p-12"
          >
            <div className="flex flex-col gap-8">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                CCS Member Benefits
              </h3>
              <ul className="flex flex-col gap-3 text-white/60 font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Academic and professional development:</strong> opportunities to join seminars, workshops, competitions, and peer-learning activities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Networking:</strong> meet students from different year levels and build connections within CCS.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-white/40 mt-0.5">✦</span>
                  <span><strong className="font-medium text-white/80">Experience for your future career:</strong> build portfolio- and resume-ready experience through projects, competitions, seminars, and organizational work.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
