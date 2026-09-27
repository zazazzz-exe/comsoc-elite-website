"use client";

import { motion } from "framer-motion";

type TransactionType = "outflow";

interface Transaction {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: string;
  type: TransactionType;
  eventRef?: string;
}

export default function BudgetSection() {
  const budgetStats = [
    { label: "Project & Event Expenses", amount: "₱34,500", percentage: 51 },
    { label: "Operational & Supplies", amount: "₱10,100", percentage: 15 },
    { label: "Remaining Balance", amount: "₱23,400", percentage: 34 },
  ];

  const transactions: Transaction[] = [
    {
      id: "out-1",
      date: "AUG 01",
      title: "Freshmen Walk Welcome Kits & Stage Decor",
      category: "Event Production",
      amount: "-₱12,500",
      type: "outflow",
      eventRef: "Freshmen Walk",
    },
    {
      id: "out-2",
      date: "JUL 28",
      title: "Campus Locker Hardware & Tagging Supplies",
      category: "Operations",
      amount: "-₱2,100",
      type: "outflow",
      eventRef: "Locker Clearance",
    },
    {
      id: "out-3",
      date: "JUL 27",
      title: "Brigada Eskwela Cleaning Supplies & Tools",
      category: "Community Prep",
      amount: "-₱3,400",
      type: "outflow",
      eventRef: "Brigada Eskwela",
    },
    {
      id: "out-4",
      date: "JUL 20",
      title: "Maxwell Leadership Camp Delegate Subsidies",
      category: "Leadership",
      amount: "-₱8,200",
      type: "outflow",
      eventRef: "Maxwell Leadership",
    },
    {
      id: "out-5",
      date: "JUL 15",
      title: "CCS SSO Deliberation Refreshments & Supplies",
      category: "Operations",
      amount: "-₱1,800",
      type: "outflow",
      eventRef: "CCS SSO",
    },
    {
      id: "out-6",
      date: "JUL 08",
      title: "Induction & Oath Taking Venue & Tokens",
      category: "Event Production",
      amount: "-₱6,500",
      type: "outflow",
      eventRef: "Oath Taking",
    },
  ];

  return (
    <section id="budget" className="bg-[#121212] w-full relative overflow-hidden font-sans text-white py-24 px-6 md:px-12 lg:px-16 border-t border-white/10">
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
              \\ 06
            </div>
            <h2 className="text-[clamp(1.75rem,8vw,5rem)] md:text-[clamp(2.5rem,6vw,5rem)] font-display font-light tracking-[0.1em] md:tracking-[0.15em] leading-[1] uppercase text-white">
              Budget &<br />Transparency
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-md">
            Foster trust and accountability within the student body by making Comsoc’s budget and project expenses fully visible.
          </p>
        </motion.div>

        {/* Budget Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Stats & Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-12"
          >
            <div className="flex justify-between items-end">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                Financial Summary
              </h3>
            </div>
            
            <div className="flex flex-col gap-8 border-t border-white/10 pt-8">
              {budgetStats.map((stat, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm md:text-base font-sans text-white/70 uppercase tracking-wider">{stat.label}</span>
                    <span className="text-xl md:text-2xl font-display text-white">{stat.amount}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 relative overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ${
                        index === 2 ? "bg-emerald-400/80" : "bg-white/40"
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Summary Card */}
            <div className="pt-4 border-t border-white/10">
              <div className="p-4 border border-white/10 bg-white/[0.02]">
                <span className="text-xs uppercase tracking-widest text-rose-400/90 font-mono block mb-1">Total Expenses</span>
                <span className="text-xl font-display text-white">-₱44,600</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Transactions Ledger */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl md:text-3xl font-heading font-light tracking-[0.2em] uppercase text-white/90">
                Event Expenses
              </h3>
            </div>
            
            <div className="flex flex-col border-t border-white/10 max-h-[480px] overflow-y-auto pr-2 pb-4" data-lenis-prevent>
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="group flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 border-b border-white/10 hover:bg-white/[0.02] transition-colors duration-300 px-4 gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                    <div className="text-sm font-display uppercase tracking-[0.1em] text-white/40 group-hover:text-white transition-colors duration-300 w-16 shrink-0 font-mono">
                      {tx.date}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-base md:text-lg font-heading font-light tracking-wide text-white group-hover:text-white/90">
                        {tx.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/50 tracking-wider uppercase font-sans">
                        <span>{tx.category}</span>
                        {tx.eventRef && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-white/70 italic font-mono text-[11px]">{tx.eventRef}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-lg md:text-xl font-display shrink-0 px-3 py-1 rounded border text-white/90 border-white/10 bg-white/5"
                  >
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
