"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import type { GalleryEvent, ModalEvent, UpcomingEvent } from "@/lib/data/events";
import EventCalendar from "./EventCalendar";

function formatBudget(amount: number) {
  return `₱${amount.toLocaleString()}`;
}

export default function EventsSection({ upcoming, gallery }: { upcoming: UpcomingEvent[]; gallery: GalleryEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<ModalEvent | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const handleSelectRange = useCallback((start: Date | null, end: Date | null) => {
    setSelectedDateRange(start && end ? { start, end } : null);
  }, []);

  const filteredUpcomingEvents = upcoming.filter(event => {
    if (!selectedDateRange) return true;
    
    // Parse event date
    const [monthStr, daysStr] = event.date.split(" ");
    if (!monthStr || !daysStr) return false;
    
    const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth();
    if (isNaN(monthIndex)) return false;

    const currentYear = new Date().getFullYear();
    let eventStart = 0;
    let eventEnd = 0;

    if (daysStr.includes("-")) {
      const [start, end] = daysStr.split("-").map(Number);
      eventStart = new Date(currentYear, monthIndex, start).getTime();
      eventEnd = new Date(currentYear, monthIndex, end).getTime();
    } else {
      const day = parseInt(daysStr, 10);
      eventStart = new Date(currentYear, monthIndex, day).getTime();
      eventEnd = eventStart;
    }

    const rangeStart = selectedDateRange.start.getTime();
    const rangeEnd = selectedDateRange.end.getTime();

    // Check if event overlaps with selected range
    return eventStart <= rangeEnd && eventEnd >= rangeStart;
  });

  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEvent]);

  return (
    <section id="events" className="bg-[#121212] w-full relative font-sans text-white py-24 px-6 md:px-12 lg:px-16 border-t border-white/10">
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
              \\ 05
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.15em] leading-[1] uppercase text-white">
              Events &<br />Gallery
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            Discover our latest gatherings, from competitive hackathons to insightful technical summits, designed to elevate your skills.
          </p>
        </motion.div>

        {/* Calendar & Upcoming Events Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 xl:gap-24 items-start">
          
          {/* Calendar Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="xl:sticky xl:top-32 relative z-20"
          >
            <EventCalendar onSelectRange={handleSelectRange} />
          </motion.div>

          {/* Upcoming Events */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col gap-8 md:gap-12"
          >
            <div className="flex justify-between items-end">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                Upcoming Events
              </h3>
              <div className="hidden md:flex gap-2 text-white/40">
                ✦ ✦ ✦
              </div>
            </div>

            <div className="flex flex-col border-t border-white/10">
              {filteredUpcomingEvents.length > 0 ? (
                filteredUpcomingEvents.map((event, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    key={event.id}
                    layoutId={`event-card-${event.id}`}
                    onClick={() => setSelectedEvent(event)}
                    className="group flex flex-row justify-between items-center py-6 md:py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 px-2 md:px-8 cursor-pointer gap-4"
                  >
                    <div className="flex flex-col md:flex-row gap-2 md:gap-16 items-start md:items-center flex-1">
                      <div className="text-xl md:text-3xl font-display uppercase tracking-[0.1em] text-white/40 group-hover:text-white transition-colors duration-300 md:w-32">
                        {event.date}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-lg md:text-2xl font-heading font-light tracking-wide text-white group-hover:text-white/90">
                          {event.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-white/50 tracking-wider uppercase font-sans">
                          <span>{event.location} • {event.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {event.budget && (
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-white/[0.03]">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-heading">Budget</span>
                          <span className="text-sm font-mono text-white/80">{formatBudget(event.budget)}</span>
                        </div>
                      )}
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5">
                          <path d="M1 13L13 1M13 1H3.4M13 1V10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center text-white/50 font-sans tracking-wide">
                  No upcoming events for the selected dates.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Event Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-12"
        >
          <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
            Event Gallery
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((event, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                layoutId={`event-card-${event.id}`}
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`group relative aspect-square overflow-hidden border border-white/10 cursor-pointer ${i === 1 ? 'lg:translate-y-8' : ''}`}
              >
                <motion.div layoutId={`event-image-${event.id}`} className="absolute inset-0 w-full h-full bg-[#121212]">
                  <div className="absolute inset-0 z-0">
                    <Image src={event.coverImage} alt="" fill className="object-cover blur-2xl opacity-40 scale-110" />
                  </div>
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover relative z-10 transform group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
                  />
                </motion.div>
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/70 font-heading mb-1">{event.date}</div>
                  <div className="text-lg font-display uppercase tracking-wide text-white">{event.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expanded Gallery Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg overflow-y-auto"
            onClick={() => setSelectedEvent(null)}
            data-lenis-prevent
          >
            <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[60]">
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 bg-black/50 backdrop-blur-md"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8 lg:p-12">
              <motion.div
                layoutId={`event-card-${selectedEvent.id}`}
                className="relative w-full max-w-6xl bg-[#121212] border border-white/10 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header in Modal */}
                <div className={`flex flex-col md:flex-row w-full bg-[#0a0a0a] ${(selectedEvent.type === 'gallery' && selectedEvent.images.filter(src => src !== selectedEvent.coverImage).length > 0) ? 'border-b border-white/10' : ''}`}>
                  {selectedEvent.coverImage && (
                    <motion.div layoutId={`event-image-${selectedEvent.id}`} className="relative w-full md:w-[50%] lg:w-[50%] shrink-0 flex flex-col justify-center bg-[#050505] overflow-hidden min-h-[300px] md:min-h-full">
                      {/* Ambient Background */}
                      <div className="absolute inset-0 z-0 pointer-events-none">
                        <Image src={selectedEvent.coverImage} alt="" fill className="object-cover blur-3xl opacity-30 scale-125" />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                      
                      {/* Foreground Image */}
                      <div className="relative z-10 w-full h-full p-6 md:p-8 lg:p-10 flex items-center justify-center">
                        <Image
                          src={selectedEvent.coverImage}
                          alt={selectedEvent.title}
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ width: '100%', height: 'auto', maxHeight: '85vh' }}
                          className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-md"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="relative w-full flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-3 items-center text-sm uppercase tracking-[0.2em] text-white/70 font-heading mb-4"
                    >
                      <span>{selectedEvent.date}</span>
                      {(selectedEvent.location || selectedEvent.time) && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/30" />
                          <span>{selectedEvent.location} {selectedEvent.time ? `• ${selectedEvent.time}` : ''}</span>
                        </>
                      )}
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-4xl md:text-5xl lg:text-7xl font-display uppercase tracking-wide text-white leading-[1.1]"
                    >
                      {selectedEvent.title}
                    </motion.h2>

                    {selectedEvent.type === 'upcoming' && selectedEvent.description && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-white/60 font-sans text-sm md:text-base max-w-2xl leading-relaxed whitespace-pre-wrap"
                      >
                        {selectedEvent.description}
                      </motion.div>
                    )}
                    {selectedEvent.type === 'gallery' && selectedEvent.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-white/60 font-sans text-sm md:text-base max-w-2xl leading-relaxed"
                      >
                        {selectedEvent.subtitle}
                      </motion.p>
                    )}

                    {selectedEvent.budget && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 p-4 border border-white/10 bg-white/[0.02] inline-flex flex-col gap-1"
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-heading">Allocated Budget</span>
                        <span className="text-2xl md:text-3xl font-display text-white">{formatBudget(selectedEvent.budget)}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Additional Images Grid */}
                {selectedEvent.type === 'gallery' && selectedEvent.images.filter(src => src !== selectedEvent.coverImage).length > 0 && (
                  <div className="p-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {selectedEvent.images.filter(src => src !== selectedEvent.coverImage).map((src, idx) => (
                        <div key={idx} className="relative aspect-square overflow-hidden bg-white/5 border border-white/5">
                          <Image
                            src={src}
                            alt={`${selectedEvent.title} - ${idx + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
