"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { upcomingEvents } from "@/lib/data/events";

// Helper to parse "JUL 27" or "JUL 27-30" or "AUG 3-4"
const parseEventDates = () => {
  const dates: Record<string, boolean> = {};
  const currentYear = new Date().getFullYear(); // Use the current year as a base

  upcomingEvents.forEach(event => {
    // Basic parsing: "JUL 27-30" or "JUL 27"
    const [monthStr, daysStr] = event.date.split(" ");
    if (!monthStr || !daysStr) return;
    
    // Create a dummy date to parse the month index (0-11)
    const monthIndex = new Date(`${monthStr} 1, 2000`).getMonth();
    if (isNaN(monthIndex)) return;

    if (daysStr.includes("-")) {
      const [start, end] = daysStr.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        dates[`${currentYear}-${monthIndex}-${i}`] = true;
      }
    } else {
      const day = parseInt(daysStr, 10);
      dates[`${currentYear}-${monthIndex}-${day}`] = true;
    }
  });

  return dates;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type EventCalendarProps = {
  onSelectRange?: (start: Date | null, end: Date | null) => void;
};

export default function EventCalendar({ onSelectRange }: EventCalendarProps = {}) {
  // Hardcode start month to July (6) to match the events data for this showcase
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getFullYear(), 6, 1)); 
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const eventDates = parseEventDates();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const onSelectRangeRef = useRef(onSelectRange);
  useEffect(() => {
    onSelectRangeRef.current = onSelectRange;
  }, [onSelectRange]);

  useEffect(() => {
    if (selectionStart && selectionEnd) {
      const start = selectionStart.getTime() < selectionEnd.getTime() ? selectionStart : selectionEnd;
      const end = selectionStart.getTime() > selectionEnd.getTime() ? selectionStart : selectionEnd;
      onSelectRangeRef.current?.(start, end);
    } else {
      onSelectRangeRef.current?.(null, null);
    }
  }, [selectionStart, selectionEnd]);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const handleMouseDown = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectionStart(date);
    setSelectionEnd(date);
    setIsDragging(true);
  };

  const handleMouseEnter = (day: number) => {
    if (isDragging) {
      setSelectionEnd(new Date(currentYear, currentMonth, day));
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="flex flex-col gap-8 w-full border border-white/10 p-6 md:p-8 bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
          {monthName} {currentYear}
        </h3>
        <div className="flex gap-4">
          <button 
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-2 md:gap-y-4">
        {/* Weekdays */}
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-[10px] md:text-xs font-heading tracking-[0.2em] text-white/40 mb-4">
            {day}
          </div>
        ))}
        
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12 md:h-16" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${currentYear}-${currentMonth}-${day}`;
          const hasEvent = eventDates[dateKey];
          
          const currentCellDate = new Date(currentYear, currentMonth, day).getTime();
          let isSelected = false;
          let isSelectionStart = false;
          let isSelectionEnd = false;
          
          if (selectionStart && selectionEnd) {
            const start = Math.min(selectionStart.getTime(), selectionEnd.getTime());
            const end = Math.max(selectionStart.getTime(), selectionEnd.getTime());
            isSelected = currentCellDate >= start && currentCellDate <= end;
            isSelectionStart = currentCellDate === start;
            isSelectionEnd = currentCellDate === end;
          }

          const dayOfWeek = (firstDayOfMonth + i) % 7;
          const isRowStart = dayOfWeek === 0;
          const isRowEnd = dayOfWeek === 6;

          return (
            <div 
              key={day} 
              className="flex justify-center items-center h-12 md:h-16 relative group cursor-pointer select-none"
              onMouseDown={() => handleMouseDown(day)}
              onMouseEnter={() => handleMouseEnter(day)}
            >
              <span className={`text-sm md:text-base font-sans z-20 transition-colors duration-300 ${hasEvent ? 'text-black font-semibold' : isSelected ? 'text-white font-semibold' : 'text-white/60 group-hover:text-white'}`}>
                {day}
              </span>
              
              {/* Event highlight */}
              {hasEvent && (
                <motion.div 
                  className={`absolute inset-1 md:inset-2 bg-white rounded-sm z-10 ${isSelected ? 'shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Selection highlight */}
              {isSelected && (
                <motion.div 
                  className={`absolute inset-y-1 md:inset-y-2 bg-white/20 z-0 
                    ${isSelectionStart || isRowStart ? 'left-1 md:left-2 rounded-l-sm' : 'left-0'} 
                    ${isSelectionEnd || isRowEnd ? 'right-1 md:right-2 rounded-r-sm' : 'right-0'}
                    ${(isSelectionStart || isRowStart) && (isSelectionEnd || isRowEnd) ? 'inset-x-1 md:inset-x-2 rounded-sm' : ''}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                />
              )}

              {!hasEvent && !isSelected && (
                <div className="absolute inset-1 md:inset-2 border border-white/0 group-hover:border-white/10 rounded-sm transition-colors duration-300 z-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
